import { Clock } from "../domain/ports/DeviceServices";
export class SystemClock implements Clock {
  now() {
    return Date.now();
  }
}
