import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ITask } from '../interface/task.interface';

export class UpdateTaskDto implements ITask {
  @ApiProperty({
    example: '1',
    description: 'The id of the task',
    required: true,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Title of the task',
    required: true,
    type: String,
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'Content of the task',
    required: true,
    type: String,
  })
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'if the task is done',
    required: true,
    type: String,
  })
  @IsOptional()
  isDone: boolean;
}
