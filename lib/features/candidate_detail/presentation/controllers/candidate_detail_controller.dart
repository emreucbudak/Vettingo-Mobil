import 'package:flutter/foundation.dart';

import '../../domain/entities/candidate_detail.dart';
import '../../domain/usecases/get_candidate_detail.dart';
import '../../domain/usecases/get_candidate_pipeline_action.dart';
import '../../domain/usecases/save_candidate_pipeline_action.dart';

class CandidateDetailController extends ChangeNotifier {
  CandidateDetailController(
    GetCandidateDetail getCandidateDetail,
    this._getPipelineAction,
    this._savePipelineAction,
  ) : candidate = getCandidateDetail();

  final GetCandidatePipelineAction _getPipelineAction;
  final SaveCandidatePipelineAction _savePipelineAction;
  final CandidateDetail candidate;
  bool _experienceExpanded = true;
  bool _educationExpanded = false;

  bool get experienceExpanded => _experienceExpanded;
  bool get educationExpanded => _educationExpanded;
  CandidatePipelineAction get pipelineAction =>
      _getPipelineAction(candidate.id);
  DateTime? get scheduledDate => _getPipelineAction.scheduledDate(candidate.id);

  void toggleExperience() {
    _experienceExpanded = !_experienceExpanded;
    notifyListeners();
  }

  void toggleEducation() {
    _educationExpanded = !_educationExpanded;
    notifyListeners();
  }

  void scheduleInterview(DateTime date) {
    _savePipelineAction(
      candidate.id,
      CandidatePipelineAction.interviewScheduled,
      scheduledDate: date,
    );
    notifyListeners();
  }

  void advanceCandidate() {
    if (pipelineAction == CandidatePipelineAction.advanced) return;
    _savePipelineAction(candidate.id, CandidatePipelineAction.advanced);
    notifyListeners();
  }
}
