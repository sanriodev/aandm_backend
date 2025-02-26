import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ITaskList } from '../interface/tasklist.interface';
import { TaskDto } from './task.dto';

export class TaskListDto implements ITaskList {
  @ApiProperty({
    description: 'Unique identifier of the tasklist',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'name of the tasklist',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: 'tasks',
    required: true,
    type: String,
  })
  @IsOptional()
  tasks: TaskDto[];
}
