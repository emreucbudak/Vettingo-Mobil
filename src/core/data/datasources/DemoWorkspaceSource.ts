import { applications } from "../../../features/applications/data/fixtures/applications";
import { cv } from "../../../features/cv/data/fixtures/cv";
import { requisitions } from "../../../features/requisitions/data/fixtures/requisitions";
import { assessment } from "../../../features/assessment/data/fixtures/assessment";
import { Workspace } from "../../domain/entities/Workspace";
export function initialWorkspace(): Workspace {
  return JSON.parse(
    JSON.stringify({
      version: 1,
      applications,
      cv,
      requisitions,
      decisions: {},
      draft: null,
      notifications: true,
      assessment,
    }),
  );
}
