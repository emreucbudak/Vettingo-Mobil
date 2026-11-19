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
  const [validation, setValidation] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const { control, setValue, handleSubmit } = useForm<
    ExamFormValues,
    unknown,
    ValidatedExamFormValues
  >({
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
      onChangeText: (value: string) => {
        setValue(name, value, { shouldDirty: true });
        setValidation(null);
      },
    };
  }

  function addQuestion(type: ExamQuestionType) {
    append(
      { type, questionText: "", weight: "", answer: "", options: {} },
      { shouldFocus: false },
    );
    setValidation(null);
  }

  const validate = handleSubmit(
    () => setValidation({ error: false, message: "Form doğrulandı." }),
    (errors) => {
      const message =
        errors.title?.message ??
        errors.durationMinutes?.message ??
        errors.passingScore?.message ??
        errors.questions?.root?.message ??
        errors.questions?.message ??
        fields
          .map((_, index) => {
            const error = errors.questions?.[index];
            if (!error) return undefined;
            const issue =
              error.questionText?.message ??
              error.weight?.message ??
              error.answer?.message ??
              "Soru seçeneklerini kontrol edin.";
            return `Soru ${index + 1}: ${issue}`;
          })
          .find(Boolean) ??
        "Sınav bilgilerini kontrol edin.";
      setValidation({ error: true, message });
    },
  );

  return { fields, addQuestion, input, validate, validation };
}
