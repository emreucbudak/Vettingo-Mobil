import '../entities/requisition.dart';
import '../repositories/requisition_repository.dart';

class GetRequisitionCatalog {
  const GetRequisitionCatalog(this._repository);

  final RequisitionRepository _repository;

  RequisitionCatalog call() => _repository.getCatalog();
}
