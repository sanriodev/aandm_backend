import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from './task.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto extends TaskDto {
  @ApiProperty({
    example: '5f312908321980',
    description: 'The id of the tasklist',
    required: true,
  })
  @IsNotEmpty()
  tasklistId: string;
}
