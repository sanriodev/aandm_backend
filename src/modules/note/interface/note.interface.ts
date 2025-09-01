export interface INote {
  id: number;
  title: string;
  privacyMode: number;
  userId: string;
  lastModifiedUserId: string;
  content?: string;
}
