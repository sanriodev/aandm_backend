import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskListDto {
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
    example: 'privacy mode',
    description: 'The privacy mode of the tasklist',
    required: true,
  })
  @IsOptional()
  privacyMode: number;
}
