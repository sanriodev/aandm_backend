import { ITask } from '../../task/interface/task.interface';

export interface ITaskList {
  id: number;
  name: string;
  tasks?: ITask[];
  userId: string;
}
