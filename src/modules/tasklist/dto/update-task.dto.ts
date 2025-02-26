import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TaskDto } from './task.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto extends OmitType(TaskDto, [
  'content',
  'title',
] as const) {
  @ApiProperty({
    example: '5f312908321980',
    description: 'The id of the tasklist',
    required: true,
  })
  @IsNotEmpty()
  tasklistId: string;

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
}
