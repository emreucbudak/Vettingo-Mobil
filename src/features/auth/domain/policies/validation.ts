import { Session } from "../entities/Session";

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
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Geçerli bir e-posta adresi girin.";
  if (values.password.length < 6)
    errors.password = "Şifre en az 6 karakter olmalıdır.";
  if (register) {
    if ((values.name?.trim().length ?? 0) < 2)
      errors.name = "Ad en az 2 karakter olmalıdır.";
    if ((values.surname?.trim().length ?? 0) < 2)
      errors.surname = "Soyad en az 2 karakter olmalıdır.";
    if (role !== "candidate" && (values.company?.trim().length ?? 0) < 2)
      errors.company = "Şirket adı en az 2 karakter olmalıdır.";
    if (!values.terms) errors.terms = "Devam etmek için koşulları kabul edin.";
  }
  return errors;
}
