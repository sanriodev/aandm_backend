import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDatabaseService } from '../common/base_database.service';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService extends BaseDatabaseService<
  Task,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(
    @InjectRepository(Task)
    protected readonly taskListRepository: Repository<Task>,
  ) {
    super(taskListRepository);
  }
}
