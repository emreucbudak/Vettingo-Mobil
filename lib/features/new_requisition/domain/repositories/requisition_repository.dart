import '../entities/requisition.dart';

abstract interface class RequisitionRepository {
  RequisitionCatalog getCatalog();

  void saveDraft(RequisitionDraft draft);

  RequisitionDraft? getLastSavedDraft();
}
