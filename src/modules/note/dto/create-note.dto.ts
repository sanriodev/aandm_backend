import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'id of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Title of the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  title: string;
}
