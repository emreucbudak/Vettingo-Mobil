import { CandidateDecisions } from "../../../features/candidates/domain/entities/Candidate";
import { Application } from "../../../features/applications/domain/entities/Application";
import { Cv } from "../../../features/cv/domain/entities/Cv";
import { Requisition } from "../../../features/requisitions/domain/entities/Requisition";
import { Assessment } from "../../../features/assessment/domain/entities/Assessment";

export interface Workspace {
  version: 1;
  applications: Application[];
  cv: Cv;
  decisions: CandidateDecisions;
  requisitions: Requisition[];
  draft: Requisition | null;
  assessment: Assessment;
  notifications: boolean;
}
