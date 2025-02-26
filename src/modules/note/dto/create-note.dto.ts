import { OmitType } from '@nestjs/swagger';
import { NoteDto } from './note.dto';

export class CreateNoteDto extends OmitType(NoteDto, ['_id'] as const) {}
