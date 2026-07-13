import '../entities/candidate_cv_review.dart';
import '../repositories/cv_review_repository.dart';

class GetCvReview {
  const GetCvReview(this._repository);

  final CvReviewRepository _repository;

  CandidateCvReview call() => _repository.getReview();
}
