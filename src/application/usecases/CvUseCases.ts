import { Cv } from "../../domain/entities/models";
import { CvDocumentPicker } from "../../domain/ports/DeviceServices";
import {
  addCvSkill,
  validateCv,
  validateDocumentSize,
} from "../../domain/policies/profile";

export class CvUseCases {
  constructor(private readonly picker: CvDocumentPicker) {}
  validate = validateCv;
  addSkill = addCvSkill;
  complete(cv: Cv): Cv | null {
    return validateCv(cv)
      ? null
      : { ...cv, summary: cv.summary.trim(), completed: true };
  }
  async pickDocument(): Promise<{ name: string } | { error: string } | null> {
    const file = await this.picker.pick();
    if (!file) return null;
    return validateDocumentSize(file.size)
      ? { name: file.name }
      : { error: "En fazla 10 MB boyutunda bir dosya seçin." };
  }
}
