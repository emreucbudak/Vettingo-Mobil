export type Role = "candidate" | "employer" | "hr";
export interface Session {
  email: string;
  name: string;
  role: Role;
  company: string;
  remember: boolean;
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
