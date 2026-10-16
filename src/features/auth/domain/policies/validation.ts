import { Session } from "../entities/Session";
import { z } from "zod";

export const authenticationSchema = z
  .object({
    email: z
      .string()
      .refine(
        (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
        "Geçerli bir e-posta adresi girin.",
      ),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    name: z.string().optional(),
    surname: z.string().optional(),
    company: z.string().optional(),
    terms: z.boolean().optional(),
    register: z.boolean(),
    role: z.enum(["candidate", "employer", "hr"]),
    remember: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.register) return;
    if ((values.name?.trim().length ?? 0) < 2)
      context.addIssue({
        code: "custom",
        path: ["name"],
        message: "Ad en az 2 karakter olmalıdır.",
      });
    if ((values.surname?.trim().length ?? 0) < 2)
      context.addIssue({
        code: "custom",
        path: ["surname"],
        message: "Soyad en az 2 karakter olmalıdır.",
      });
    if (values.role !== "candidate" && (values.company?.trim().length ?? 0) < 2)
      context.addIssue({
        code: "custom",
        path: ["company"],
        message: "Şirket adı en az 2 karakter olmalıdır.",
      });
    if (!values.terms)
      context.addIssue({
        code: "custom",
        path: ["terms"],
        message: "Devam etmek için koşulları kabul edin.",
      });
  });

export function validateAuth(
  values: {
    email: string;
    password: string;
    name?: string;
    surname?: string;
    company?: string;
    terms?: boolean;
  },
  register: boolean,
  role: Session["role"],
) {
  const result = authenticationSchema.safeParse({
    ...values,
    register,
    role,
    remember: true,
  });
  const errors: Record<string, string> = {};
  if (!result.success)
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field])
        errors[field] = issue.message;
    }
  return errors;
}
