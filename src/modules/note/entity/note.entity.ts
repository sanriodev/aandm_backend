import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { INote } from '../interface/note.interface';
import { Privacy } from '../../common/enum/privacy.enum';

@Entity()
export class Note implements INote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: false, default: Privacy.Private })
  privacyMode: Privacy;

  @Column({ nullable: false })
  lastModifiedUserId: string;

  @Column({ nullable: false })
  userId: string;
}
