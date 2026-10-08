import * as DocumentPicker from "expo-document-picker";
import { CvDocumentPicker } from "../domain/ports/CvDocumentPicker";
export class ExpoCvDocumentPicker implements CvDocumentPicker {
  async pick() {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return null;
    return { name: result.assets[0].name, size: result.assets[0].size ?? 0 };
  }
}
