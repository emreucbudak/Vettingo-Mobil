import {
  CvCredentials,
  CvRepository,
} from "../../domain/repositories/CvRepository";

export class ApiCvRepository implements CvRepository {
  constructor(private readonly request: typeof fetch) {}

  async hasCv({ accessToken }: CvCredentials): Promise<boolean> {
    const response = await this.request(
      "http://localhost:5083/api/evaluations/cv/exists",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "CV durumunu kontrol etmek için hesabınıza yeniden giriş yapın.",
      );
    }
    if (!response.ok) {
      throw new Error("CV durumu kontrol edilemedi. Lütfen tekrar deneyin.");
    }

    const hasCv: unknown = await response.json();
    if (typeof hasCv !== "boolean") {
      throw new Error("CV durumu kontrol edilemedi. Lütfen tekrar deneyin.");
    }
    return hasCv;
  }
}
