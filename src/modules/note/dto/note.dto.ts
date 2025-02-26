import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { INote } from '../interface/note.interface';

export class NoteDto implements INote {
  @ApiProperty({
    description: 'Unique identifier of the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'Title of the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    description: 'User who created the note',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  user: string;
  @ApiProperty({
    description: 'Content of the note',
    required: false,
    type: String,
  })
  @IsOptional()
  content?: string;
}
