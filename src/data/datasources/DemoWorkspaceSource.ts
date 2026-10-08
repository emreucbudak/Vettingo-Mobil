import { applications, cv, requisitions } from "../fixtures/demo";
import { Workspace } from "../../domain/entities/models";
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
      assessment: {
        answers: {
          "react-effects": "dependency-array",
          "typescript-immutability": "const",
          "react-mount": "effect",
          "current-question": "userdata-loop",
        },
        currentIndex: 3,
        deadline: null,
        finished: false,
      },
    }),
  );
}
