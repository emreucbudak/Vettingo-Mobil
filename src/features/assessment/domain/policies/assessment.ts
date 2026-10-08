import { Assessment } from "../entities/Assessment";
export const ASSESSMENT_DURATION_MS = 2535 * 1000;
export function remainingSeconds(assessment: Assessment, now: number) {
  return Math.max(
    0,
    Math.ceil(
      ((assessment.deadline ?? now + ASSESSMENT_DURATION_MS) - now) / 1000,
    ),
  );
}
