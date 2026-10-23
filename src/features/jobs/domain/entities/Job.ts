export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  office?: string;
  locationType?: "remote" | "hybrid" | "onsite";
  salary: string;
  experienceYears?: number;
  experienceRange?: { min: number; max: number };
  skills?: string[];
  match: number;
  tags: string[];
}
export interface JobCatalog {
  jobs: Job[];
  recommendations: Job[];
}
