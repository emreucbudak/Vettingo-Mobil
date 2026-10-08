import { Role } from "../../domain/entities/Session";
export function homeFor(role: Role) {
  return `/${role}-dashboard` as const;
}
