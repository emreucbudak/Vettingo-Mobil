import AsyncStorage from "@react-native-async-storage/async-storage";
export class AsyncStorageSource {
  private writes: Promise<void> = Promise.resolve();
  read(key: string) {
    return AsyncStorage.getItem(key);
  }
  // A slow previous write must never overwrite the latest workspace or session.
  write(key: string, value: string | null): Promise<void> {
    const next = this.writes
      .catch(() => {})
      .then(() =>
        value === null
          ? AsyncStorage.removeItem(key)
          : AsyncStorage.setItem(key, value),
      );
    this.writes = next;
    return next;
  }
  async flush() {
    await this.writes.catch(() => {});
  }
}
