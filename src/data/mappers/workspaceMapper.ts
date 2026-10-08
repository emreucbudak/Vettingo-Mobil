import { Workspace } from "../../domain/entities/models";
export function restoreWorkspace(
  raw: string | null,
  fresh: Workspace,
  questionCount: number,
): Workspace {
  if (!raw) return fresh;
  try {
    const data = JSON.parse(raw) as Workspace;
    if (
      data.version !== 1 ||
      !Array.isArray(data.applications) ||
      !Array.isArray(data.requisitions) ||
      !data.cv?.skills ||
      !data.assessment?.answers ||
      !data.decisions
    )
      return fresh;
    return {
      ...fresh,
      ...data,
      assessment: {
        ...data.assessment,
        currentIndex: Math.max(
          0,
          Math.min(
            questionCount - 1,
            Number(data.assessment.currentIndex) || 0,
          ),
        ),
      },
    };
  } catch {
    return fresh;
  }
}
