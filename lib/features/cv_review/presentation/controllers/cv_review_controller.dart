import 'package:flutter/foundation.dart';

import '../../domain/entities/candidate_cv_review.dart';
import '../../domain/usecases/get_cv_review.dart';
import '../../domain/usecases/save_cv_review.dart';

class CvReviewController extends ChangeNotifier {
  CvReviewController(GetCvReview getReview, this._saveReview)
    : _review = getReview();

  final SaveCvReview _saveReview;
  CandidateCvReview _review;
  bool _reuploadRequested = false;
  bool _completed = false;

  CandidateCvReview get review => _review;
  bool get reuploadRequested => _reuploadRequested;
  bool get completed => _completed;

  void updateSummary(String value) {
    final summary = value.trim();
    if (summary.isEmpty || summary == _review.summary) return;
    _review = _review.copyWith(summary: summary);
    notifyListeners();
  }

  void addSkill(String value) {
    final skill = value.trim();
    if (skill.isEmpty ||
        _review.coreSkills.any(
          (item) => item.toLowerCase() == skill.toLowerCase(),
        )) {
      return;
    }
    _review = _review.copyWith(coreSkills: [..._review.coreSkills, skill]);
    notifyListeners();
  }

  void removeSkill(String skill) {
    _review = _review.copyWith(
      coreSkills: _review.coreSkills
          .where((item) => item != skill)
          .toList(growable: false),
    );
    notifyListeners();
  }

  void updateExperience(int index, CvExperience experience) {
    if (index < 0 || index >= _review.experiences.length) return;
    final experiences = [..._review.experiences];
    experiences[index] = experience;
    _review = _review.copyWith(experiences: experiences);
    notifyListeners();
  }

  void updateEducation(CvEducation education) {
    _review = _review.copyWith(education: education);
    notifyListeners();
  }

  void requestReupload() {
    if (_reuploadRequested) return;
    _reuploadRequested = true;
    notifyListeners();
  }

  void completeReview() {
    if (_completed) return;
    _saveReview(_review);
    _completed = true;
    notifyListeners();
  }
}
