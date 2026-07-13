import '../entities/candidate_cv_review.dart';

abstract interface class CvReviewRepository {
  CandidateCvReview getReview();

  void saveReview(CandidateCvReview review);
}
