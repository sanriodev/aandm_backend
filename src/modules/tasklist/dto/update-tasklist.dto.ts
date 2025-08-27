import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ITaskList } from '../interface/tasklist.interface';

export class UpdateTaskListDto implements ITaskList {
  @ApiProperty({
    example: '1',
    description: 'The id of the tasklist',
    required: true,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 'Personal Tasks',
    description: 'The name of the tasklist',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'id of the user',
    description: 'The id of the user',
    required: true,
  })
  @IsOptional()
  userId: string;
}
