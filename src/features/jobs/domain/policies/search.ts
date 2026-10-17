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
        if (filter.startsWith("salary:")) {
          const [, min, max] = filter.split(":");
          const amounts = [...job.salary.matchAll(/\$([\d,]+)(k)?/gi)].map(
            (value) =>
              Number(value[1].replaceAll(",", "")) * (value[2] ? 1000 : 1),
          );
          return (
            amounts.length > 0 &&
            Math.max(...amounts) >= Number(min) &&
            Math.min(...amounts) <= Number(max)
          );
        }
        if (filter.startsWith("experience:")) {
          const [, min, max] = filter.split(":");
          return (
            job.experienceYears !== undefined &&
            job.experienceYears >= Number(min) &&
            job.experienceYears <= Number(max)
          );
        }
        if (filter === "Onsite") return !/remote|hybrid/i.test(job.location);
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
