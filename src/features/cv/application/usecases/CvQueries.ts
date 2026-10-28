import {
  CvCredentials,
  CvRepository,
} from "../../domain/repositories/CvRepository";

export class CvQueries {
  constructor(private readonly repository: CvRepository) {}

  async hasCv(credentials: Partial<CvCredentials> | null): Promise<boolean> {
    if (!credentials?.accessToken?.trim()) {
      throw new Error(
        "CV durumunu kontrol etmek için hesabınıza yeniden giriş yapın.",
      );
    }

    return this.repository.hasCv({
      accessToken: credentials.accessToken,
    });
  }
}
