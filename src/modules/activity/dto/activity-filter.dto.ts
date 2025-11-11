import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ActivityFilterDto {
  @ApiProperty({
    example: 10,
    description: 'Number of items to take',
  })
  @IsOptional()
  limit: number = 50;

  @ApiProperty({
    example: 'own',
    description: 'Filter mode',
  })
  @IsOptional()
  mode: 'own' | 'any';
}
