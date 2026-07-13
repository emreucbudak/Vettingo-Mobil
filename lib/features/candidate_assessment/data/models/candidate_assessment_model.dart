import '../../domain/entities/candidate_assessment.dart';

class AssessmentOptionModel {
  const AssessmentOptionModel({required this.id, required this.text});

  final String id;
  final String text;

  AssessmentOption toEntity() => AssessmentOption(id: id, text: text);
}

class AssessmentQuestionModel {
  const AssessmentQuestionModel({
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
  final List<AssessmentOptionModel> options;

  AssessmentQuestion toEntity() => AssessmentQuestion(
    id: id,
    category: category,
    difficulty: difficulty,
    prompt: prompt,
    fileName: fileName,
    code: code,
    options: options.map((option) => option.toEntity()).toList(growable: false),
  );
}

class CandidateAssessmentModel {
  const CandidateAssessmentModel({
    required this.title,
    required this.remainingTimeLabel,
    required this.questions,
  });

  final String title;
  final String remainingTimeLabel;
  final List<AssessmentQuestionModel> questions;

  CandidateAssessment toEntity() {
    final entities = questions
        .map((question) => question.toEntity())
        .toList(growable: true);
    while (entities.length < 20) {
      final number = entities.length + 1;
      entities.add(
        AssessmentQuestion(
          id: 'question-$number',
          category: 'Technical Assessment',
          difficulty: number.isEven ? 'Medium' : 'Hard',
          prompt:
              'Review the implementation below and choose the answer that best follows maintainable software engineering practices.',
          fileName: 'solution_$number.dart',
          code: 'final result = service.process(input);',
          options: const [
            AssessmentOption(
              id: 'separation',
              text:
                  'Keep responsibilities separated and dependencies explicit.',
            ),
            AssessmentOption(
              id: 'global-state',
              text: 'Move all state into mutable global variables.',
            ),
            AssessmentOption(
              id: 'ignore-errors',
              text: 'Ignore failures and retry every operation forever.',
            ),
            AssessmentOption(
              id: 'duplicate',
              text: 'Duplicate the implementation in each screen.',
            ),
          ],
        ),
      );
    }
    return CandidateAssessment(
      title: title,
      remainingTimeLabel: remainingTimeLabel,
      questions: List.unmodifiable(entities),
    );
  }

  static const demo = CandidateAssessmentModel(
    title: 'Technical Assessment',
    remainingTimeLabel: '42:15',
    questions: [
      AssessmentQuestionModel(
        id: 'react-effects',
        category: 'Technical Assessment',
        difficulty: 'Hard',
        prompt:
            'Given the following React component, what is the most likely reason for the infinite loop occurring in the console? Select the best explanation from the choices below.',
        fileName: 'UserProfile.jsx',
        code: '''import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`/api/users/\${userId}`)
      .then(res => res.json())
      .then(data => setUserData(data));
  }, [userData, userId]);

  if (!userData) return <div>Loading...</div>;
  return <div>{userData.name}</div>;
}''',
        options: [
          AssessmentOptionModel(
            id: 'api-404',
            text:
                'The API endpoint is returning a 404 error, causing the fetch to retry infinitely.',
          ),
          AssessmentOptionModel(
            id: 'dependency-array',
            text:
                '`userData` is included in the dependency array. Updating it triggers the effect again, which updates it again.',
          ),
          AssessmentOptionModel(
            id: 'userid-render',
            text:
                'The component re-renders every time `userId` is accessed inside the effect.',
          ),
          AssessmentOptionModel(
            id: 'missing-await',
            text:
                'The fetch request is missing an `await` keyword, causing asynchronous execution loops.',
          ),
        ],
      ),
      AssessmentQuestionModel(
        id: 'dart-immutability',
        category: 'Technical Assessment',
        difficulty: 'Medium',
        prompt:
            'Which Dart declaration best communicates that a collection reference should not be reassigned?',
        fileName: 'profile.dart',
        code: 'final skills = <String>[\'Flutter\', \'Dart\'];',
        options: [
          AssessmentOptionModel(id: 'var', text: 'Declare it with `var`.'),
          AssessmentOptionModel(id: 'final', text: 'Declare it with `final`.'),
          AssessmentOptionModel(id: 'late', text: 'Declare it with `late`.'),
          AssessmentOptionModel(id: 'dynamic', text: 'Use `dynamic`.'),
        ],
      ),
      AssessmentQuestionModel(
        id: 'flutter-build',
        category: 'Technical Assessment',
        difficulty: 'Medium',
        prompt:
            'What is the safest place to start an asynchronous request that should run once when a StatefulWidget is inserted?',
        fileName: 'profile_page.dart',
        code: '''@override
void initState() {
  super.initState();
  loadProfile();
}''',
        options: [
          AssessmentOptionModel(id: 'build', text: 'Inside `build`.'),
          AssessmentOptionModel(id: 'init-state', text: 'Inside `initState`.'),
          AssessmentOptionModel(id: 'dispose', text: 'Inside `dispose`.'),
          AssessmentOptionModel(
            id: 'constructor',
            text: 'Inside every constructor call.',
          ),
        ],
      ),
      AssessmentQuestionModel(
        id: 'current-question',
        category: 'Technical Assessment',
        difficulty: 'Hard',
        prompt:
            'Given the following React component, what is the most likely reason for the infinite loop occurring in the console? Select the best explanation from the choices below.',
        fileName: 'UserProfile.jsx',
        code: '''useEffect(() => {
  fetch(`/api/users/\${userId}`)
    .then(res => res.json())
    .then(data => setUserData(data));
}, [userData, userId]);''',
        options: [
          AssessmentOptionModel(
            id: 'api-error',
            text:
                'The API endpoint is returning a 404 error, causing the fetch to retry infinitely.',
          ),
          AssessmentOptionModel(
            id: 'userdata-loop',
            text:
                '`userData` is included in the dependency array. Updating it triggers the effect again, which updates it again.',
          ),
          AssessmentOptionModel(
            id: 'access-render',
            text:
                'The component re-renders every time `userId` is accessed inside the effect.',
          ),
          AssessmentOptionModel(
            id: 'await-loop',
            text:
                'The fetch request is missing an `await` keyword, causing asynchronous execution loops.',
          ),
        ],
      ),
      AssessmentQuestionModel(
        id: 'widget-keys',
        category: 'Technical Assessment',
        difficulty: 'Easy',
        prompt:
            'What do Flutter keys primarily help the framework preserve when a widget list changes?',
        fileName: 'skills_list.dart',
        code: 'SkillTile(key: ValueKey(skill.id), skill: skill)',
        options: [
          AssessmentOptionModel(id: 'network', text: 'Network cache entries.'),
          AssessmentOptionModel(
            id: 'identity',
            text: 'Widget identity and associated state.',
          ),
          AssessmentOptionModel(id: 'theme', text: 'The current color scheme.'),
          AssessmentOptionModel(id: 'route', text: 'The navigator route name.'),
        ],
      ),
    ],
  );
}
