import { Prop } from '@nestjs/mongoose';
import { ITask } from '../interface/task.interface';

export class Task implements ITask {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isDone: boolean;
}
