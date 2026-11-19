import { z } from "zod";

export const examTitleLimits = { create: 100, update: 2000 } as const;

const integerInput = z
  .string()
  .trim()
  .regex(/^\d+$/, "Tam sayı girin.")
  .transform(Number);

const questionSchema = z
  .object({
    type: z.enum(["multiple-choice", "true-false"]),
    questionText: z
      .string()
      .trim()
      .min(1, "Soru metni boş bırakılamaz.")
      .max(2000, "Soru metni en fazla 2000 karakter olabilir."),
    weight: integerInput.pipe(
      z.int32().positive("Soru ağırlığı sıfırdan büyük olmalıdır."),
    ),
    answer: z.string(),
    options: z.record(
      z.string(),
      z.string().trim().max(2000, "Seçenek en fazla 2000 karakter olabilir."),
    ),
  })
  .superRefine(({ type, answer, options }, context) => {
    const hasCorrectAnswer =
      type === "multiple-choice"
        ? /^[A-E]$/.test(answer) && Boolean(options[answer])
        : answer === "Doğru" || answer === "Yanlış";

    if (!hasCorrectAnswer) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message:
          type === "multiple-choice"
            ? "Metni girilmiş bir seçeneği doğru cevap olarak işaretleyin."
            : "Doğru cevabı işaretleyin.",
      });
    }
  });

const examFormSchema = z.object({
  durationMinutes: integerInput.pipe(
    z.int32().positive("Sınav süresi sıfırdan büyük olmalıdır."),
  ),
  questions: z.array(questionSchema).min(1, "En az bir soru ekleyin."),
});

export const createExamFormSchema = examFormSchema.extend({
  title: z
    .string()
    .trim()
    .min(1, "Sınav adı boş bırakılamaz.")
    .max(examTitleLimits.create, "Sınav adı en fazla 100 karakter olabilir."),
  passingScore: integerInput.pipe(
    z.int32().min(1, "Geçme puanı en az 1 olmalıdır."),
  ),
});

export const updateExamFormSchema = examFormSchema.extend({
  title: z
    .string()
    .trim()
    .min(1, "Sınav adı boş bırakılamaz.")
    .max(examTitleLimits.update, "Sınav adı en fazla 2000 karakter olabilir."),
  passingScore: integerInput.pipe(
    z.int32().min(0, "Geçme puanı negatif olamaz."),
  ),
});

export type ExamFormValues = z.input<typeof createExamFormSchema>;
export type ValidatedExamFormValues = z.output<typeof createExamFormSchema>;
export type ExamQuestionType = ExamFormValues["questions"][number]["type"];
