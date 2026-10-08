import { Application } from "../../domain/entities/Application";
import { Job } from "../../../jobs/domain/entities/Job";
export class ApplicationUseCases {
  apply(applications: Application[], job: Job): Application[] {
    return applications.some((item) => item.id === job.id)
      ? applications
      : [
          {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            status: "Applied",
            progress: 0.25,
            next: "Başvuru gönderildi",
          },
          ...applications,
        ];
  }
}
