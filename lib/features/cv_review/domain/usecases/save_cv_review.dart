import '../entities/candidate_cv_review.dart';
import '../repositories/cv_review_repository.dart';

class SaveCvReview {
  const SaveCvReview(this._repository);

  final CvReviewRepository _repository;

  void call(CandidateCvReview review) => _repository.saveReview(review);
}
