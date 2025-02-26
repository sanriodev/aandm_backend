import { OmitType } from '@nestjs/swagger';
import { TaskListDto } from './tasklist.dto';

export class CreateTaskListDto extends OmitType(TaskListDto, [
  '_id',
] as const) {}
