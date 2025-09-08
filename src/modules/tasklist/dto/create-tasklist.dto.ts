import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskListDto {
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
  @IsNotEmpty()
  userId: string;
}
