import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePrivacyModeDto {
  @ApiProperty({
    description: 'ID of the entity to update',
    example: '1',
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'New privacy mode for the note',
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  privacyMode: number;
}
