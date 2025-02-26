import { ITask } from './task.interface';

export interface ITaskList {
  _id: string;
  name: string;
  tasks?: ITask[];
}
