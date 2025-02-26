import { IsNotEmpty, IsOptional } from 'class-validator';
import { ITask } from '../interface/task.interface';
import { ApiProperty } from '@nestjs/swagger';
import { boolean } from 'joi';

export class TaskDto implements ITask {
  @ApiProperty({
    description: 'Title of the task',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the task',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'state of the task',
    required: true,
    type: boolean,
  })
  @IsOptional()
  isDone: boolean = false;
}
