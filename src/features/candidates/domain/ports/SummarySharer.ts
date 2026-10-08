export interface SummarySharer {
  share(title: string, message: string): Promise<void>;
}
