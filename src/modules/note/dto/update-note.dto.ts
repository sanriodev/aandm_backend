import { ApiProperty, PickType } from '@nestjs/swagger';
import { NoteDto } from './note.dto';
import { IsOptional } from 'class-validator';

export class UpdateNoteDto extends PickType(NoteDto, [
  '_id',
  'content',
] as const) {
  @ApiProperty({
    description: 'Title of the note',
    required: true,
    type: String,
  })
  @IsOptional()
  title: string;
  @ApiProperty({
    description: 'User who created the note',
    required: true,
    type: String,
  })
  @IsOptional()
  user: string;
}
