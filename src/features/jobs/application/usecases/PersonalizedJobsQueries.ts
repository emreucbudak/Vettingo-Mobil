import {
  PersonalizedJobsCredentials,
  PersonalizedJobsRepository,
} from "../../domain/repositories/PersonalizedJobsRepository";

export class PersonalizedJobsQueries {
  constructor(private readonly repository: PersonalizedJobsRepository) {}

  async list(credentials: Partial<PersonalizedJobsCredentials> | null) {
    if (!credentials?.accessToken) {
      return [];
    }
    return this.repository.list({ accessToken: credentials.accessToken });
  }
}
