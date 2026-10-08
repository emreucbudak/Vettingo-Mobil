import { Role } from "../../domain/entities/models";
export function homeFor(role: Role) {
  return `/${role}-dashboard` as const;
}
