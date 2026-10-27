export interface JobSummary {
  id: string;
  title: string;
  company: string;
  location: string;
  office?: string;
  locationType?: "remote" | "hybrid" | "onsite";
  employmentType?: string;
  salary: string;
  experienceYears?: number;
  experienceRange?: { min: number; max: number };
  skills?: string[];
  tags: string[];
}
export interface Job extends JobSummary {
  match: number;
}
export interface JobCatalog {
  jobs: Job[];
  recommendations: Job[];
}
