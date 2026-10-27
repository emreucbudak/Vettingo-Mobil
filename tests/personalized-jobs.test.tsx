import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { createAppServices } from "../src/composition/createAppServices";
import { AppProvider } from "../src/core/presentation/state/AppProvider";
import { PersonalizedJobsQueries } from "../src/features/jobs/application/usecases/PersonalizedJobsQueries";
import { ApiPersonalizedJobsRepository } from "../src/features/jobs/data/repositories/ApiPersonalizedJobsRepository";
import PersonalizedJobsScreen from "../src/features/jobs/presentation/screens/PersonalizedJobsScreen";

const posting = {
  jobPostingId: "019a16b1-1234-7000-8000-000000000001",
  companyId: "019a16b1-1234-7000-8000-000000000002",
  companyName: "Vettingo Teknoloji",
  title: "Backend Developer",
  cityName: "İstanbul",
  employmentType: 2,
  workingModel: 3,
  minimumExperienceYear: 2,
  maximumExperienceYear: 5,
  minSalary: 50000,
  maxSalary: 75000,
  requirementSkills: { "C#": 3, SQL: 2 },
};
const response = (body: unknown, status = 200) =>
  ({
    ok: status === 200,
    status,
    json: async () => body,
  }) as Response;

afterEach(() => jest.restoreAllMocks());

test("loads job card data with the token and no company request", async () => {
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockResolvedValue(response([posting]));
  const repository = new ApiPersonalizedJobsRepository(request);
  const jobs = await repository.list({ accessToken: "candidate-token" });

  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith(
    "http://localhost:5257/api/personalized-job-postings/user",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer candidate-token",
      },
    },
  );
  expect(jobs[0]).toMatchObject({
    id: posting.jobPostingId,
    title: posting.title,
    location: "İstanbul",
    company: posting.companyName,
    employmentType: "Yarı Zamanlı",
    locationType: "hybrid",
    experienceRange: { min: 2, max: 5 },
    salary: "50.000–75.000 ₺",
    skills: ["C#", "SQL"],
  });
});

test.each([401, 403, 500])(
  "rejects HTTP %s instead of showing an empty result",
  async (status) => {
    const request = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(response([], status));
    await expect(
      new ApiPersonalizedJobsRepository(request).list({ accessToken: "token" }),
    ).rejects.toThrow();
  },
);

test("does not fetch without an access token", async () => {
  const repository = { list: jest.fn() };
  expect(await new PersonalizedJobsQueries(repository).list({})).toEqual([]);
  expect(repository.list).not.toHaveBeenCalled();
});

test("renders API values in the existing card and opens the job ID", async () => {
  const services = createAppServices();
  const request = jest
    .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
    .mockResolvedValue(response([posting]));
  services.personalizedJobs = new PersonalizedJobsQueries(
    new ApiPersonalizedJobsRepository(request),
  );
  jest.spyOn(services.sessions, "restore").mockResolvedValue({
    session: {
      accessToken: "token",
      userId: "candidate",
      email: "test@example.com",
      name: "Alex",
      role: "candidate",
      company: "",
      remember: false,
    },
    state: services.sessions.createWorkspace(),
  });
  const view = await render(
    <AppProvider services={services}>
      <PersonalizedJobsScreen />
    </AppProvider>,
  );
  await waitFor(() => expect(view.getByText(posting.title)).toBeTruthy());
  for (const text of [
    "Vettingo Teknoloji · İstanbul",
    "Yarı Zamanlı · Hybrid",
    "Tecrübe 2–5 yıl",
    "Maaş 50.000–75.000 ₺",
    "C#",
    "SQL",
  ]) {
    expect(view.getByText(text)).toBeTruthy();
  }
  await fireEvent.press(
    view.getByRole("button", { name: `${posting.title} ilan detayını aç` }),
  );
  expect(router.push).toHaveBeenCalledWith({
    pathname: "/job-detail",
    params: { id: posting.jobPostingId, tab: "profile" },
  });
});
