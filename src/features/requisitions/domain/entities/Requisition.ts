export interface Requisition {
  id: string;
  title: string;
  department: string;
  locationType: "remote" | "hybrid" | "onsite";
  office: string;
  skills: string[];
  marketCompensation: boolean;
  salaryRange?: { min: number; max: number };
  experienceRange?: { min: number; max: number };
  description: string;
  status: "Sourcing" | "Interviewing";
  candidateLabel: string;
}
export interface RequisitionState {
  requisitions: Requisition[];
  draft: Requisition | null;
}
