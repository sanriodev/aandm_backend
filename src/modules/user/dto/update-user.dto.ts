import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'id of the user',
    example: '103290-12',
    required: true,
  })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    description: 'nickname of the user',
    example: 'nickname',
    required: false,
  })
  @IsOptional()
  nickname: string;
}
