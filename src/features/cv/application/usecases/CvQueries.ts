import {
  CvCredentials,
  CvRepository,
} from "../../domain/repositories/CvRepository";

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const emptyGuid = "00000000-0000-0000-0000-000000000000";

export class CvQueries {
  constructor(private readonly repository: CvRepository) {}

  async hasCv(credentials: Partial<CvCredentials> | null): Promise<boolean> {
    if (
      !credentials?.userId ||
      !guid.test(credentials.userId) ||
      credentials.userId === emptyGuid ||
      !credentials.accessToken?.trim()
    ) {
      throw new Error(
        "CV durumunu kontrol etmek için hesabınıza yeniden giriş yapın.",
      );
    }

    return this.repository.hasCv({
      userId: credentials.userId,
      accessToken: credentials.accessToken,
    });
  }
}
