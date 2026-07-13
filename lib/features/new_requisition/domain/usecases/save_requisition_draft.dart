import '../entities/requisition.dart';
import '../repositories/requisition_repository.dart';

class SaveRequisitionDraft {
  const SaveRequisitionDraft(this._repository);

  final RequisitionRepository _repository;

  void call(RequisitionDraft draft) => _repository.saveDraft(draft);
}
