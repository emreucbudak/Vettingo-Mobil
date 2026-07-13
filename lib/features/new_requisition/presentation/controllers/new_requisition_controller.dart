import 'package:flutter/foundation.dart';

import '../../domain/entities/requisition.dart';
import '../../domain/usecases/get_requisition_catalog.dart';
import '../../domain/usecases/save_requisition_draft.dart';

class NewRequisitionController extends ChangeNotifier {
  NewRequisitionController(GetRequisitionCatalog getCatalog, this._saveDraft)
    : catalog = getCatalog();

  final SaveRequisitionDraft _saveDraft;
  final RequisitionCatalog catalog;
  String _jobTitle = '';
  String? _department;
  WorkLocationType _locationType = WorkLocationType.remote;
  String? _office;
  final Set<String> _selectedSkills = {};
  bool _useMarketCompensation = false;
  bool _descriptionDrafted = false;
  String? _validationMessage;

  String get jobTitle => _jobTitle;
  String? get department => _department;
  WorkLocationType get locationType => _locationType;
  String? get office => _office;
  Set<String> get selectedSkills => Set.unmodifiable(_selectedSkills);
  bool get useMarketCompensation => _useMarketCompensation;
  bool get descriptionDrafted => _descriptionDrafted;
  String? get validationMessage => _validationMessage;
  bool get requiresOffice => _locationType != WorkLocationType.remote;

  void updateJobTitle(String value) {
    if (_jobTitle == value) return;
    _jobTitle = value;
    _validationMessage = null;
    notifyListeners();
  }

  void selectDepartment(String? value) {
    if (_department == value) return;
    _department = value;
    _validationMessage = null;
    notifyListeners();
  }

  void selectLocationType(WorkLocationType value) {
    if (_locationType == value) return;
    _locationType = value;
    if (!requiresOffice) _office = null;
    _validationMessage = null;
    notifyListeners();
  }

  void selectOffice(String? value) {
    if (_office == value) return;
    _office = value;
    _validationMessage = null;
    notifyListeners();
  }

  void toggleSkill(String skill) {
    if (!_selectedSkills.remove(skill)) _selectedSkills.add(skill);
    notifyListeners();
  }

  void applyMarketCompensation() {
    if (_useMarketCompensation) return;
    _useMarketCompensation = true;
    notifyListeners();
  }

  void autoDraftDescription() {
    if (_descriptionDrafted) return;
    _descriptionDrafted = true;
    notifyListeners();
  }

  bool continueToNextStep() {
    final title = _jobTitle.trim();
    if (title.isEmpty) {
      _setValidationMessage('Enter a job title to continue.');
      return false;
    }
    final department = _department;
    if (department == null) {
      _setValidationMessage('Select a department to continue.');
      return false;
    }
    if (requiresOffice && _office == null) {
      _setValidationMessage('Select an office location to continue.');
      return false;
    }
    _validationMessage = null;
    _saveDraft(
      RequisitionDraft(
        jobTitle: title,
        department: department,
        locationType: _locationType,
        office: _office,
        skills: List.unmodifiable(_selectedSkills),
        useMarketCompensation: _useMarketCompensation,
      ),
    );
    notifyListeners();
    return true;
  }

  void _setValidationMessage(String message) {
    _validationMessage = message;
    notifyListeners();
  }
}
