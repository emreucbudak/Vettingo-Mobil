export type Role = "candidate" | "employer" | "hr";
export type Stage = "screening" | "interview" | "offer" | "rejected";
export type Decision =
  "pending" | "advanced" | "rejected" | "interviewScheduled";
export interface Session {
  email: string;
  name: string;
  role: Role;
  company: string;
  remember: boolean;
}
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  tags: string[];
}
export interface Application {
  id: string;
  title: string;
  company: string;
  location: string;
  status: "Applied" | "Interviewing" | "Rejected";
  progress: number;
  next: string;
}
export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}
export interface Education {
  degree: string;
  institution: string;
  period: string;
}
export interface Cv {
  summary: string;
  skills: string[];
  experiences: Experience[];
  education: Education;
  completed: boolean;
  fileName?: string;
}
export interface Candidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  appliedRole: string;
  match: number;
  stage: Stage;
  skills: { name: string; level: string; score: number }[];
  summary: string;
  experiences: Experience[];
  education: Education[];
  requirements: { name: string; result: string }[];
}
export interface Requisition {
  id: string;
  title: string;
  department: string;
  locationType: "remote" | "hybrid" | "onsite";
  office: string;
  skills: string[];
  marketCompensation: boolean;
  description: string;
  status: "Sourcing" | "Interviewing";
  candidateLabel: string;
}
export interface Question {
  id: string;
  category: string;
  difficulty: string;
  prompt: string;
  fileName: string;
  code: string;
  options: { id: string; text: string }[];
}
export interface Assessment {
  answers: Record<string, string>;
  currentIndex: number;
  deadline: number | null;
  finished: boolean;
}
export interface Workspace {
  version: 1;
  applications: Application[];
  cv: Cv;
  decisions: Record<string, { action: Decision; date?: string }>;
  requisitions: Requisition[];
  draft: Requisition | null;
  assessment: Assessment;
  notifications: boolean;
}

export interface AuthenticationInput {
  email: string;
  password: string;
  name?: string;
  surname?: string;
  company?: string;
  terms?: boolean;
  register: boolean;
  role: Role;
  remember: boolean;
}
export interface RecruitmentCatalog {
  jobs: Job[];
  recommendations: Job[];
  candidates: Candidate[];
  comparisonCandidates: Candidate[];
  questions: Question[];
  filters: { departments: string[]; offices: string[]; skills: string[] };
}
