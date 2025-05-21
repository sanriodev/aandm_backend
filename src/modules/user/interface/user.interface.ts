export interface IUser {
  _id: string;
  username: string;
  nickname?: string;
  password: string;
  accessToken?: string;
  refreshTokens?: string[];
}
