import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  get,
  useFieldArray,
  useForm,
  useWatch,
  type FieldPathByValue,
} from "react-hook-form";
import {
  createExamFormSchema,
  updateExamFormSchema,
  type ExamFormValues,
  type ExamQuestionType,
  type ValidatedExamFormValues,
} from "./examFormSchema";

export function useExamForm(mode: "create" | "update") {
  const [validationPassed, setValidationPassed] = useState(false);
  const {
    control,
    getFieldState,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<ExamFormValues, unknown, ValidatedExamFormValues>({
    resolver: zodResolver(
      mode === "create" ? createExamFormSchema : updateExamFormSchema,
    ),
    defaultValues: {
      title: "",
      durationMinutes: "",
      passingScore: "",
      questions: [],
    },
  });
  const { fields, append } = useFieldArray({ control, name: "questions" });
  const values = useWatch({ control });

  function input(name: FieldPathByValue<ExamFormValues, string>) {
    return {
      value: get(values, name, "") as string,
      error: getFieldState(name).error?.message,
      onChangeText: (value: string) => {
        setValue(name, value, { shouldDirty: true });
        setValidationPassed(false);
        if (isSubmitted) {
          const [group, index] = name.split(".");
          void trigger(
            group === "questions" ? `questions.${Number(index)}` : name,
          );
        }
      },
    };
  }

  function addQuestion(type: ExamQuestionType) {
    append(
      { type, questionText: "", weight: "", answer: "", options: {} },
      { shouldFocus: false },
    );
    setValidationPassed(false);
  }

  const validate = handleSubmit(
    () => setValidationPassed(true),
    () => setValidationPassed(false),
  );
  const questionListError =
    fields.length === 0
      ? (errors.questions?.root?.message ?? errors.questions?.message)
      : undefined;

  return {
    fields,
    addQuestion,
    input,
    validate,
    validationPassed,
    questionListError,
  };
}
