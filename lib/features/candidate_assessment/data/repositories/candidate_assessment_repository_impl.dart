import '../../domain/entities/candidate_assessment.dart';
import '../../domain/repositories/candidate_assessment_repository.dart';
import '../datasources/candidate_assessment_data_source.dart';

class CandidateAssessmentRepositoryImpl
    implements CandidateAssessmentRepository {
  const CandidateAssessmentRepositoryImpl(this._dataSource);

  final CandidateAssessmentDataSource _dataSource;

  @override
  CandidateAssessment getAssessment() => _dataSource.getAssessment().toEntity();

  @override
  String? getAnswer(String questionId) => _dataSource.getAnswer(questionId);

  @override
  void saveAnswer(String questionId, String optionId) {
    _dataSource.saveAnswer(questionId, optionId);
  }
}
