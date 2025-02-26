import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteTaskDto {
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
  @IsNotEmpty()
  title: string;
}
