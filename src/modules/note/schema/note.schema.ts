import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { INote } from '../interface/note.interface';

@Schema()
export class Note implements INote {
  @Prop({ required: true, unique: true, index: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  content: string;

  @Prop({ required: true })
  user: string;

  constructor(data) {
    Object.assign(this, data);
  }
}
export type NoteDocument = Note & Document;

export const NoteSchema = SchemaFactory.createForClass(Note);
