import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'password of the user',
    example: 'password123',
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
