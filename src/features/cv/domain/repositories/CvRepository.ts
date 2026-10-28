export interface CvCredentials {
  accessToken: string;
}

export interface CvRepository {
  hasCv(credentials: CvCredentials): Promise<boolean>;
}
