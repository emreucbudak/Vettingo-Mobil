export interface CvCredentials {
  userId: string;
  accessToken: string;
}

export interface CvRepository {
  hasCv(credentials: CvCredentials): Promise<boolean>;
}
