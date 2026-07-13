class AssessmentOption {
  const AssessmentOption({required this.id, required this.text});

  final String id;
  final String text;
}

class AssessmentQuestion {
  const AssessmentQuestion({
    required this.id,
    required this.category,
    required this.difficulty,
    required this.prompt,
    required this.fileName,
    required this.code,
    required this.options,
  });

  final String id;
  final String category;
  final String difficulty;
  final String prompt;
  final String fileName;
  final String code;
  final List<AssessmentOption> options;
}

class CandidateAssessment {
  const CandidateAssessment({
    required this.title,
    required this.remainingTimeLabel,
    required this.questions,
  });

  final String title;
  final String remainingTimeLabel;
  final List<AssessmentQuestion> questions;
}
