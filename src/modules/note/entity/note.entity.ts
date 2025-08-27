import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { INote } from '../interface/note.interface';

@Entity()
export class Note implements INote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: false })
  userId: string;
}
