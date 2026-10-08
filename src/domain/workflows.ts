import { applications, cv, questions, requisitions } from "../data/demo";
import {
  Action,
  Candidate,
  Job,
  Requisition,
  Session,
  Workspace,
} from "./models";

export const roleLabels = {
  candidate: "İş Arayan",
  employer: "İşveren",
  hr: "İK",
};
export const stageLabels = {
  screening: "Ön Eleme",
  interview: "Mülakat",
  offer: "Teklif",
  rejected: "Reddedildi",
};
export const decisionLabels = {
  pending: "Bekliyor",
  advanced: "İlerletildi",
  rejected: "Reddedildi",
  interviewScheduled: "Mülakat Planlandı",
};
export function homeFor(role: Session["role"]) {
  return `/${role}-dashboard` as const;
}
export function initialWorkspace(): Workspace {
  return JSON.parse(
    JSON.stringify({
      version: 1,
      applications,
      cv,
      requisitions,
      decisions: {},
      draft: null,
      notifications: true,
      assessment: {
        answers: {
          "react-effects": "dependency-array",
          "typescript-immutability": "const",
          "react-mount": "effect",
          "current-question": "userdata-loop",
        },
        currentIndex: 3,
        deadline: null,
        finished: false,
      },
    }),
  );
}
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
export function workspaceReducer(state: Workspace, action: Action): Workspace {
  switch (action.type) {
    case "cv":
      return { ...state, cv: action.cv };
    case "decision":
      return {
        ...state,
        decisions: {
          ...state.decisions,
          [action.candidateId]: {
            action: action.action,
            ...(action.action === "interviewScheduled" && action.date
              ? { date: action.date }
              : {}),
          },
        },
      };
    case "apply":
      return state.applications.some((item) => item.id === action.job.id)
        ? state
        : {
            ...state,
            applications: [
              {
                id: action.job.id,
                title: action.job.title,
                company: action.job.company,
                location: action.job.location,
                status: "Applied",
                progress: 0.25,
                next: "Başvuru gönderildi",
              },
              ...state.applications,
            ],
          };
    case "draft":
      return { ...state, draft: action.draft };
    case "publish":
      return validateRequisition(action.requisition)
        ? state
        : {
            ...state,
            draft: null,
            requisitions: [
              action.requisition,
              ...state.requisitions.filter(
                (item) => item.id !== action.requisition.id,
              ),
            ],
          };
    case "answer": {
      const question = questions.find((item) => item.id === action.questionId);
      if (
        state.assessment.finished ||
        !question?.options.some((option) => option.id === action.optionId)
      )
        return state;
      return {
        ...state,
        assessment: {
          ...state.assessment,
          answers: {
            ...state.assessment.answers,
            [action.questionId]: action.optionId,
          },
        },
      };
    }
    case "question":
      return action.index < 0 || action.index >= questions.length
        ? state
        : {
            ...state,
            assessment: { ...state.assessment, currentIndex: action.index },
          };
    case "start-assessment":
      return state.assessment.deadline || state.assessment.finished
        ? state
        : {
            ...state,
            assessment: {
              ...state.assessment,
              deadline: action.now + 2535 * 1000,
            },
          };
    case "finish-assessment":
      return { ...state, assessment: { ...state.assessment, finished: true } };
    case "notifications":
      return { ...state, notifications: action.enabled };
  }
}
export function restoreWorkspace(raw: string | null): Workspace {
  const fresh = initialWorkspace();
  if (!raw) return fresh;
  try {
    const data = JSON.parse(raw) as Workspace;
    if (
      data.version !== 1 ||
      !Array.isArray(data.applications) ||
      !Array.isArray(data.requisitions) ||
      !data.cv?.skills ||
      !data.assessment?.answers ||
      !data.decisions
    )
      return fresh;
    return {
      ...fresh,
      ...data,
      assessment: {
        ...data.assessment,
        currentIndex: Math.max(
          0,
          Math.min(
            questions.length - 1,
            Number(data.assessment.currentIndex) || 0,
          ),
        ),
      },
    };
  } catch {
    return fresh;
  }
}
