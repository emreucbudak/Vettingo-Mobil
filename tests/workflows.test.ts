import { candidates, jobs, questions } from "../src/data/fixtures/demo";
import { Requisition } from "../src/domain/entities/models";
import {
  candidateStage,
  filterJobs,
  validateAuth,
  validateRequisition,
} from "../src/domain/policies/recruitment";
import { homeFor } from "../src/presentation/navigation/routes";
import { initialWorkspace } from "../src/data/datasources/DemoWorkspaceSource";
import { restoreWorkspace as restore } from "../src/data/mappers/workspaceMapper";
import { DemoRecruitmentRepository } from "../src/data/repositories/DemoRecruitmentRepository";
import { RecruitmentQueries } from "../src/application/usecases/RecruitmentQueries";
import { WorkspaceUseCases } from "../src/application/usecases/WorkspaceUseCases";
import { WorkspaceCommand } from "../src/application/contracts/WorkspaceCommand";
import { Workspace } from "../src/domain/entities/models";
import { CvUseCases } from "../src/application/usecases/CvUseCases";
import { CandidateUseCases } from "../src/application/usecases/CandidateUseCases";
import { RequisitionUseCases } from "../src/application/usecases/RequisitionUseCases";
import { AssessmentUseCases } from "../src/application/usecases/AssessmentUseCases";
import { ApplicationUseCases } from "../src/application/usecases/ApplicationUseCases";
const queries = new RecruitmentQueries(new DemoRecruitmentRepository());
let now = 0;
const useCases = new WorkspaceUseCases(
  new CvUseCases({ pick: async () => null }),
  new CandidateUseCases({ now: () => now }, { share: async () => {} }),
  new RequisitionUseCases({ now: () => now }),
  new AssessmentUseCases(queries, { now: () => now }),
  new ApplicationUseCases(),
);
beforeAll(() => queries.load());
beforeEach(() => {
  now = 0;
});
const workspaceReducer = (state: Workspace, command: WorkspaceCommand) =>
  useCases.execute(state, command);
const restoreWorkspace = (raw: string | null) =>
  restore(raw, initialWorkspace(), questions.length);

describe("Clean Architecture use cases and migration behavior", () => {
  test("job search combines all query words and active filters", () => {
    expect(
      filterJobs(jobs, "engineering Globex", []).map((item) => item.id),
    ).toEqual(["director-engineering-globex"]);
    expect(filterJobs(jobs, "", ["Remote", "Series B+"])).toHaveLength(2);
    expect(filterJobs(jobs, "Globex", ["Remote"])).toEqual([]);
    expect(filterJobs(jobs, "unmatched", [])).toEqual([]);
  });
  test("salary filter includes ranges that reach 200k", () =>
    expect(filterJobs(jobs, "", ["$200k+"])).toHaveLength(3));
  test("login rejects invalid email and short passwords for every role", () => {
    for (const role of ["candidate", "employer", "hr"] as const)
      expect(
        Object.keys(
          validateAuth({ email: "wrong", password: "123" }, false, role),
        ),
      ).toEqual(["email", "password"]);
  });
  test("registration requires personal fields, consent and company for hiring roles", () => {
    const input = {
      email: "test@vettingo.com",
      password: "secret",
      name: "Al",
      surname: "Ex",
      terms: true,
    };
    expect(validateAuth(input, true, "candidate")).toEqual({});
    expect(validateAuth(input, true, "employer")).toEqual({
      company: "Şirket adı en az 2 karakter olmalıdır.",
    });
    expect(
      validateAuth({ ...input, company: "Acme", terms: false }, true, "hr")
        .terms,
    ).toBeDefined();
  });
  test("all account roles route to their own dashboard", () => {
    expect(homeFor("candidate")).toBe("/candidate-dashboard");
    expect(homeFor("employer")).toBe("/employer-dashboard");
    expect(homeFor("hr")).toBe("/hr-dashboard");
  });
  test("application submission cannot duplicate a job", () => {
    const state = initialWorkspace();
    const once = workspaceReducer(state, { type: "apply", job: jobs[0] });
    const twice = workspaceReducer(once, { type: "apply", job: jobs[0] });
    expect(twice.applications).toHaveLength(state.applications.length + 1);
    expect(twice.applications[0].status).toBe("Applied");
  });
  test("candidate decisions persist per ID and drive stage filtering", () => {
    let state = workspaceReducer(initialWorkspace(), {
      type: "decision",
      candidateId: candidates[0].id,
      action: "rejected",
    });
    expect(candidateStage(candidates[0], state.decisions)).toBe("rejected");
    expect(candidateStage(candidates[1], state.decisions)).toBe("screening");
    state = workspaceReducer(state, {
      type: "decision",
      candidateId: candidates[0].id,
      action: "advanced",
    });
    expect(candidateStage(candidates[0], state.decisions)).toBe("offer");
  });
  test("advancing a candidate clears stale interview date", () => {
    let state = workspaceReducer(initialWorkspace(), {
      type: "decision",
      candidateId: "sarah",
      action: "interviewScheduled",
      date: "2026-12-01T10:00:00Z",
    });
    expect(state.decisions.sarah.date).toBeDefined();
    state = workspaceReducer(state, {
      type: "decision",
      candidateId: "sarah",
      action: "advanced",
    });
    expect(state.decisions.sarah.date).toBeUndefined();
  });
  test("CV review saves summary, skills and edited education", () => {
    const state = initialWorkspace();
    const updated = workspaceReducer(state, {
      type: "cv",
      cv: {
        ...state.cv,
        summary: "Updated summary",
        skills: [...state.cv.skills, "React Native"],
        education: { ...state.cv.education, institution: "Updated University" },
        completed: true,
      },
    });
    expect(updated.cv.skills).toContain("React Native");
    expect(updated.cv.completed).toBe(true);
    expect(updated.cv.education.institution).toBe("Updated University");
  });
  const draft: Requisition = {
    id: "new",
    title: "Backend Engineer",
    department: "Engineering",
    locationType: "hybrid",
    office: "",
    skills: ["Go"],
    description: "Build APIs",
    marketCompensation: false,
    candidateLabel: "New",
    status: "Sourcing",
  };
  test("hybrid and on-site roles require an office", () => {
    expect(validateRequisition(draft)).toContain("ofis");
    expect(
      validateRequisition({ ...draft, locationType: "remote" }),
    ).toBeNull();
    expect(validateRequisition({ ...draft, office: "London, UK" })).toBeNull();
    expect(validateRequisition({ ...draft, title: "" })).toContain("pozisyon");
    expect(validateRequisition({ ...draft, department: "" })).toContain(
      "departman",
    );
  });
  test("draft and publication retain role requirements", () => {
    const complete = { ...draft, office: "London, UK" };
    const state = workspaceReducer(initialWorkspace(), {
      type: "draft",
      draft: complete,
    });
    expect(restoreWorkspace(JSON.stringify(state)).draft).toEqual(complete);
    const published = workspaceReducer(state, {
      type: "publish",
      requisition: complete,
    });
    expect(published.draft).toBeNull();
    expect(published.requisitions[0]).toEqual(complete);
    expect(
      workspaceReducer(published, { type: "publish", requisition: complete })
        .requisitions,
    ).toHaveLength(4);
  });
  test("assessment contains 20 questions and the original four prefilled answers", () => {
    expect(questions).toHaveLength(20);
    expect(initialWorkspace().assessment.currentIndex).toBe(3);
    expect(Object.keys(initialWorkspace().assessment.answers)).toHaveLength(4);
  });
  test("assessment resumes its original deadline rather than resetting its timer", () => {
    now = 1000;
    const first = workspaceReducer(initialWorkspace(), {
      type: "start-assessment",
    });
    now = 50000;
    const resumed = workspaceReducer(restoreWorkspace(JSON.stringify(first)), {
      type: "start-assessment",
    });
    expect(resumed.assessment.deadline).toBe(2536000);
  });
  test("assessment rejects invalid options and locks answers after finish", () => {
    const state = initialWorkspace();
    expect(
      workspaceReducer(state, {
        type: "answer",
        questionId: questions[0].id,
        optionId: "invalid",
      }),
    ).toBe(state);
    const answered = workspaceReducer(state, {
      type: "answer",
      questionId: questions[0].id,
      optionId: "api-404",
    });
    const finished = workspaceReducer(answered, { type: "finish-assessment" });
    expect(
      workspaceReducer(finished, {
        type: "answer",
        questionId: questions[0].id,
        optionId: "dependency-array",
      }),
    ).toBe(finished);
    expect(workspaceReducer(state, { type: "question", index: 20 })).toBe(
      state,
    );
  });
  test("invalid local data falls back safely and new workspaces do not share arrays", () => {
    expect(restoreWorkspace("{broken")).toEqual(initialWorkspace());
    expect(restoreWorkspace('{"version":2}')).toEqual(initialWorkspace());
    const one = initialWorkspace();
    one.cv.skills.push("Changed");
    expect(initialWorkspace().cv.skills).not.toContain("Changed");
  });
});
