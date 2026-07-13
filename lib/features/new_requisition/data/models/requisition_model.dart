import '../../domain/entities/requisition.dart';

class RequisitionCatalogModel {
  const RequisitionCatalogModel({
    required this.departments,
    required this.offices,
    required this.suggestedSkills,
    required this.marketRange,
    required this.marketLabel,
    required this.percentile25,
    required this.median,
    required this.percentile75,
  });

  final List<String> departments;
  final List<String> offices;
  final List<String> suggestedSkills;
  final String marketRange;
  final String marketLabel;
  final String percentile25;
  final String median;
  final String percentile75;

  RequisitionCatalog toEntity() => RequisitionCatalog(
    departments: List.unmodifiable(departments),
    offices: List.unmodifiable(offices),
    suggestedSkills: List.unmodifiable(suggestedSkills),
    marketRange: marketRange,
    marketLabel: marketLabel,
    percentile25: percentile25,
    median: median,
    percentile75: percentile75,
  );

  static const demo = RequisitionCatalogModel(
    departments: ['Engineering', 'Product', 'Design', 'Sales', 'Marketing'],
    offices: ['New York, NY', 'San Francisco, CA', 'London, UK'],
    suggestedSkills: ['Python', 'Go', 'System Design', 'AWS', 'Kubernetes'],
    marketRange: r'$150k - $190k',
    marketLabel: 'US Remote',
    percentile25: r'P25: $135k',
    median: r'Median: $165k',
    percentile75: r'P75: $200k',
  );
}
