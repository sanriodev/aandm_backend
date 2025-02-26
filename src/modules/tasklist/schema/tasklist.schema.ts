import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { ITaskList } from '../interface/tasklist.interface';

@Schema()
export class TaskList implements ITaskList {
  @Prop({ required: true, unique: true, index: true })
  _id: string;

  @Prop({ required: true })
  name: string;
  @Prop({ required: false, default: [] })
  tasks: Task[];

  constructor(data) {
    Object.assign(this, data);
  }
}
export type TaskListDocument = TaskList & Document;

export const TaskListSchema = SchemaFactory.createForClass(TaskList);
