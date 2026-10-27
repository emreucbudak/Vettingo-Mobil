import { JobSummary } from "../entities/Job";

export interface PersonalizedJobsCredentials {
  accessToken: string;
}

export interface PersonalizedJobsRepository {
  list(
    credentials: PersonalizedJobsCredentials,
  ): Promise<readonly JobSummary[]>;
}
