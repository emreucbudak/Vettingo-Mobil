import '../../domain/entities/candidate_cv_review.dart';
import '../models/candidate_cv_review_model.dart';

abstract interface class CvReviewDataSource {
  CandidateCvReviewModel getReview();

  void saveReview(CandidateCvReview review);
}

class LocalCvReviewDataSource implements CvReviewDataSource {
  CandidateCvReview? _savedReview;

  CandidateCvReview? get savedReview => _savedReview;

  @override
  CandidateCvReviewModel getReview() => CandidateCvReviewModel.demo;

  @override
  void saveReview(CandidateCvReview review) {
    _savedReview = review;
  }
}
