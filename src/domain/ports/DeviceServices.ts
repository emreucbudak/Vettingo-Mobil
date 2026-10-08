export interface Clock {
  now(): number;
}
export interface CvDocument {
  name: string;
  size: number;
}
export interface CvDocumentPicker {
  pick(): Promise<CvDocument | null>;
}
export interface SummarySharer {
  share(title: string, message: string): Promise<void>;
}
