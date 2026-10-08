import { Cv } from "../entities/Cv";
export function validateCv(cv: Cv): string | null {
  return !cv.summary.trim() ||
    !cv.education.degree.trim() ||
    !cv.education.institution.trim() ||
    cv.experiences.some((item) => !item.role.trim() || !item.company.trim())
    ? "Özeti, deneyimlerdeki pozisyon/şirket alanlarını ve eğitim bilgilerini doldurun."
    : null;
}
export function addCvSkill(cv: Cv, input: string): Cv {
  const skill = input.trim();
  if (
    !skill ||
    cv.skills.some((item) => item.toLowerCase() === skill.toLowerCase())
  )
    return cv;
  return { ...cv, skills: [...cv.skills, skill], completed: false };
}
export function validateDocumentSize(size: number) {
  return size <= 10 * 1024 * 1024;
}
