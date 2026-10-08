export interface Application {
  id: string;
  title: string;
  company: string;
  location: string;
  status: "Applied" | "Interviewing" | "Rejected";
  progress: number;
  next: string;
}
