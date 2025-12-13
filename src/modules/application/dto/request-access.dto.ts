import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestAccessDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user requesting access',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Torsten',
    description: 'Username of the user requesting access',
  })
  @IsNotEmpty()
  username: string;
}
