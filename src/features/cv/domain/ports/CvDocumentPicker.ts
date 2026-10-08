export interface CvDocument {
  name: string;
  size: number;
}
export interface CvDocumentPicker {
  pick(): Promise<CvDocument | null>;
}
