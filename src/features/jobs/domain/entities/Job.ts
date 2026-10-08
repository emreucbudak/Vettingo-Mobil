export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  tags: string[];
}
export interface JobCatalog {
  jobs: Job[];
  recommendations: Job[];
}
