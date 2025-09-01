import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'id of the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'id of the user',
    required: true,
    type: String,
  })
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: 'Title of the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'content of the note',
    required: true,
    type: String,
  })
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'privacy mode of the note',
    required: true,
    type: String,
  })
  @IsOptional()
  privacyMode: number;
}
