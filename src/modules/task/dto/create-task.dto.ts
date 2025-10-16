import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: '1',
    description: 'The id of the tasklist',
    required: true,
  })
  @IsNotEmpty()
  taskListId: number;

  @ApiProperty({
    example: 'some task',
    description: 'The title of the task',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'some task description',
    description: 'The content of the task',
    required: true,
  })
  @IsOptional()
  content: string;

  @ApiProperty({
    example: false,
    description: 'If the task is done',
    required: true,
  })
  @IsOptional()
  isDone: boolean = false;
}
