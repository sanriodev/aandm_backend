import { ITask } from '../interface/task.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskList } from '../../tasklist/entity/tasklist.entity';

@Entity()
export class Task implements ITask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
  })
  content?: string;

  @Column({
    default: false,
  })
  isDone: boolean;

  @Column({
    nullable: false,
  })
  taskListId: number;

  @ManyToOne(() => TaskList, (list) => list.tasks)
  taskList: TaskList;
}
