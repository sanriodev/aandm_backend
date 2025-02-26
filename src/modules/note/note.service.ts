import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteDocument } from './schema/note.schema';
import { UnprocessableEntityException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

export class NoteService {
  constructor(
    @InjectModel('Note')
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(quoteDto: CreateNoteDto): Promise<NoteDocument> {
    try {
      return await this.noteModel.create({
        title: quoteDto.title,
        content: quoteDto.content,
        user: quoteDto.user,
      });
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  async getAll(): Promise<NoteDocument[]> {
    return await this.noteModel.find();
  }

  async getById(id: string): Promise<NoteDocument> {
    return await this.noteModel.findOne({ _id: id });
  }

  async update(dto: UpdateNoteDto): Promise<NoteDocument> {
    return await this.noteModel.findOneAndUpdate({ _id: dto._id }, dto);
  }

  async deleteById(id: string): Promise<NoteDocument> {
    return await this.noteModel.findOneAndDelete({ _id: id });
  }
}
