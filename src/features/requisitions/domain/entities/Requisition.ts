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
export interface RequisitionState {
  requisitions: Requisition[];
  draft: Requisition | null;
}
