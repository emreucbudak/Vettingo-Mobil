import { Clock } from "../domain/ports/Clock";
export class SystemClock implements Clock {
  now() {
    return Date.now();
  }
}
