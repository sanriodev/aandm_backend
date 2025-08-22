import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { INote } from '../interface/note.interface';

export class UpdateNoteDto implements INote {
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
}
