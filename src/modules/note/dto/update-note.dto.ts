import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Note } from '../entity/note.entity';

export class UpdateNoteDto extends OmitType(Note, [
  'lastModifiedUserId',
  'userId',
  'privacyMode',
]) {
  @ApiProperty({
    description: 'id of the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Title of the note',
    required: true,
    type: String,
  })
  @IsOptional()
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
