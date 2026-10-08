import { Share } from "react-native";
import { SummarySharer } from "../domain/ports/DeviceServices";
export class ReactNativeSummarySharer implements SummarySharer {
  async share(title: string, message: string) {
    await Share.share({ title, message });
  }
}
