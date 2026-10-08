import { Job, Workspace } from "../../domain/entities/models";

export class ApplicationUseCases {
  apply(state: Workspace, job: Job): Workspace {
    return state.applications.some((item) => item.id === job.id)
      ? state
      : {
          ...state,
          applications: [
            {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              status: "Applied",
              progress: 0.25,
              next: "Başvuru gönderildi",
            },
            ...state.applications,
          ],
        };
  }
}
