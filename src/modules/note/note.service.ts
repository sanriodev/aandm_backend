import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDatabaseService } from '../common/base_database.service';
import { Repository } from 'typeorm';
import { Note } from './entity/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService extends BaseDatabaseService<
  Note,
  CreateNoteDto,
  UpdateNoteDto
> {
  constructor(
    @InjectRepository(Note)
    protected readonly noteRepository: Repository<Note>,
  ) {
    super(noteRepository);
  }
}
