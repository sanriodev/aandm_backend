import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDatabaseService } from '../common/base_database.service';
import { Repository } from 'typeorm';
import { Task } from '../task/entity/task.entity';
import { TaskList } from './entity/tasklist.entity';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { UpdateTaskListDto } from './dto/update-tasklist.dto';

@Injectable()
export class TaskListService extends BaseDatabaseService<
  TaskList,
  CreateTaskListDto,
  UpdateTaskListDto
> {
  constructor(
    @InjectRepository(TaskList)
    protected readonly taskListRepository: Repository<TaskList>,
  ) {
    super(taskListRepository);
  }
}
