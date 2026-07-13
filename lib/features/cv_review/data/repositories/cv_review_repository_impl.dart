import '../../domain/entities/candidate_cv_review.dart';
import '../../domain/repositories/cv_review_repository.dart';
import '../datasources/cv_review_data_source.dart';

class CvReviewRepositoryImpl implements CvReviewRepository {
  const CvReviewRepositoryImpl(this._dataSource);

  final CvReviewDataSource _dataSource;

  @override
  CandidateCvReview getReview() => _dataSource.getReview().toEntity();

  @override
  void saveReview(CandidateCvReview review) {
    _dataSource.saveReview(review);
  }
}
