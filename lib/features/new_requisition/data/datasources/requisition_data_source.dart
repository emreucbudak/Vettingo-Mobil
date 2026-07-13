import '../../domain/entities/requisition.dart';
import '../models/requisition_model.dart';

abstract interface class RequisitionDataSource {
  RequisitionCatalogModel getCatalog();

  void saveDraft(RequisitionDraft draft);

  RequisitionDraft? getLastSavedDraft();
}

class LocalRequisitionDataSource implements RequisitionDataSource {
  RequisitionDraft? _lastSavedDraft;

  @override
  RequisitionCatalogModel getCatalog() => RequisitionCatalogModel.demo;

  @override
  RequisitionDraft? getLastSavedDraft() => _lastSavedDraft;

  @override
  void saveDraft(RequisitionDraft draft) {
    _lastSavedDraft = draft;
  }
}
