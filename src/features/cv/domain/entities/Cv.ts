import {
  Experience,
  Education,
} from "../../../../shared/domain/entities/Profile";

export interface CvCertification {
  name: string;
  type: string;
}

export interface Cv {
  summary: string;
  skills: string[];
  experiences: Experience[];
  education: Education;
  certifications?: CvCertification[];
  completed: boolean;
  fileName?: string;
}
