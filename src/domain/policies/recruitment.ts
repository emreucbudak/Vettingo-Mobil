import {
  Candidate,
  Job,
  Requisition,
  Session,
  Workspace,
} from "../entities/models";
export function matchesText(query: string, values: string[]) {
  const text = values.join(" ").toLocaleLowerCase("tr-TR");
  return query
    .trim()
    .toLocaleLowerCase("tr-TR")
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}
export function filterJobs(items: Job[], query: string, filters: string[]) {
  return items.filter(
    (job) =>
      matchesText(query, [
        job.title,
        job.company,
        job.location,
        job.salary,
        ...job.tags,
      ]) &&
      filters.every((filter) => {
        if (filter === "$200k+")
          return [...job.salary.matchAll(/\$(\d+)k/g)].some(
            (value) => Number(value[1]) >= 200,
          );
        if (filter === "Series B+")
          return job.tags.some((tag) => /^series [b-z]/i.test(tag));
        return matchesText(filter, [job.location, ...job.tags]);
      }),
  );
}
export function candidateStage(
  candidate: Candidate,
  decisions: Workspace["decisions"],
) {
  const action = decisions[candidate.id]?.action;
  return action === "rejected"
    ? "rejected"
    : action === "advanced"
      ? "offer"
      : action === "interviewScheduled"
        ? "interview"
        : candidate.stage;
}
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
export function validateRequisition(draft: Requisition) {
  if (!draft.title.trim()) return "Devam etmek için pozisyon adını girin.";
  if (!draft.department) return "Devam etmek için departman seçin.";
  if (draft.locationType !== "remote" && !draft.office)
    return "Devam etmek için ofis seçin.";
  return null;
}
