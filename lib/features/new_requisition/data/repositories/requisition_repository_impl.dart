import '../../domain/entities/requisition.dart';
import '../../domain/repositories/requisition_repository.dart';
import '../datasources/requisition_data_source.dart';

class RequisitionRepositoryImpl implements RequisitionRepository {
  const RequisitionRepositoryImpl(this._dataSource);

  final RequisitionDataSource _dataSource;

  @override
  RequisitionCatalog getCatalog() => _dataSource.getCatalog().toEntity();

  @override
  RequisitionDraft? getLastSavedDraft() => _dataSource.getLastSavedDraft();

  @override
  void saveDraft(RequisitionDraft draft) => _dataSource.saveDraft(draft);
}
