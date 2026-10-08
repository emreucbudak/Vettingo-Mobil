import {
  Experience,
  Education,
} from "../../../../shared/domain/entities/Profile";

export interface Cv {
  summary: string;
  skills: string[];
  experiences: Experience[];
  education: Education;
  completed: boolean;
  fileName?: string;
}
