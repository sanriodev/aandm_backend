import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { INote } from '../interface/note.interface';
import { Privacy } from '../../common/enum/privacy.enum';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Note implements INote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: false, default: Privacy.Private, enum: Privacy })
  privacyMode: Privacy;

  @ManyToOne(() => User, (user) => user.notes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: false })
  userId: string;

  // M:1 to User (last modified by)
  @ManyToOne(() => User, (user) => user.lastModifiedNotes, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'lastModifiedUserId', referencedColumnName: 'id' })
  lastModifiedUser: User;

  @Column({ nullable: false })
  lastModifiedUserId: string;
}
