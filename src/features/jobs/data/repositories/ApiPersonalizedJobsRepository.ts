import { z } from "zod";
import { JobSummary } from "../../domain/entities/Job";
import {
  PersonalizedJobsCredentials,
  PersonalizedJobsRepository,
} from "../../domain/repositories/PersonalizedJobsRepository";

const employmentTypes = {
  1: "Tam Zamanlı",
  2: "Yarı Zamanlı",
  3: "Staj",
  4: "Sözleşmeli",
} as const;
const workingModels = { 1: "onsite", 2: "remote", 3: "hybrid" } as const;
const postingsResponse = z.array(
  z.object({
    jobPostingId: z.string().uuid(),
    companyId: z.string().uuid(),
    companyName: z.string(),
    title: z.string().min(1),
    cityName: z.string().min(1),
    employmentType: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
    ]),
    workingModel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    minimumExperienceYear: z.number().int().nonnegative(),
    maximumExperienceYear: z.number().int().nonnegative(),
    minSalary: z.number().int().nonnegative(),
    maxSalary: z.number().int().nonnegative(),
    requirementSkills: z.record(z.string(), z.number().int()),
  }),
);
const loadError =
  "Kişiselleştirilmiş ilanlar yüklenemedi. Lütfen tekrar deneyin.";

export class ApiPersonalizedJobsRepository implements PersonalizedJobsRepository {
  constructor(
    private readonly request: typeof fetch,
    private readonly jobApiUrl = "http://localhost:5257/api",
  ) {}

  async list({
    accessToken,
  }: PersonalizedJobsCredentials): Promise<readonly JobSummary[]> {
    const init = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await this.request(
      `${this.jobApiUrl}/personalized-job-postings/user`,
      init,
    );
    this.checkResponse(response);
    const postings = postingsResponse.safeParse(await response.json());
    if (!postings.success) throw new Error(loadError);

    const number = new Intl.NumberFormat("tr-TR");
    return postings.data.map((posting) => ({
      id: posting.jobPostingId,
      title: posting.title,
      company: posting.companyName,
      location: posting.cityName,
      office: posting.cityName,
      locationType: workingModels[posting.workingModel],
      employmentType: employmentTypes[posting.employmentType],
      experienceRange: {
        min: posting.minimumExperienceYear,
        max: posting.maximumExperienceYear,
      },
      salary:
        posting.minSalary === 0 && posting.maxSalary === 0
          ? "Belirtilmedi"
          : `${number.format(posting.minSalary)}–${number.format(posting.maxSalary)} ₺`,
      skills: Object.keys(posting.requirementSkills),
      tags: Object.keys(posting.requirementSkills),
    }));
  }

  private checkResponse(response: Response) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("İlanları görmek için hesabınıza yeniden giriş yapın.");
    }
    if (!response.ok) throw new Error(loadError);
  }
}
