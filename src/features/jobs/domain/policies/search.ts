import { Job } from "../entities/Job";
import { matchesText } from "../../../../shared/domain/policies/search";

export function filterJobs(items: Job[], query: string, filters: string[]) {
  return items.filter(
    (job) =>
      matchesText(query, [
        job.title,
        job.company,
        job.location,
        job.salary,
        ...job.tags,
      ]) &&
      filters.every((filter) => {
        if (filter === "$200k+")
          return [...job.salary.matchAll(/\$(\d+)k/g)].some(
            (value) => Number(value[1]) >= 200,
          );
        if (filter === "Series B+")
          return job.tags.some((tag) => /^series [b-z]/i.test(tag));
        return matchesText(filter, [job.location, ...job.tags]);
      }),
  );
}
