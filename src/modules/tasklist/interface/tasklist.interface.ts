import { ITask } from '../../task/interface/task.interface';

export interface ITaskList {
  id: number;
  name: string;
  tasks?: ITask[];
  privacyMode: number;
  lastModifiedUserId: string;
  userId: string;
}
