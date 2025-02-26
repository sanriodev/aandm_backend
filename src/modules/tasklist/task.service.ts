import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTaskDto } from './dto/update-Task.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { TaskListDocument } from './schema/tasklist.schema';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

export class TaskService {
  constructor(
    @InjectModel('TaskList')
    private readonly taskListModel: Model<TaskListDocument>,
  ) {}

  async createTaskList(quoteDto: CreateTaskListDto): Promise<TaskListDocument> {
    try {
      return await this.taskListModel.create({
        name: quoteDto.name,
        tasks: quoteDto.tasks,
      });
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  async createTask(dto: CreateTaskDto): Promise<TaskListDocument> {
    const { tasklistId, ...update } = dto;

    return await this.taskListModel.findOneAndUpdate(
      { _id: tasklistId },
      { $push: { tasks: update } },
      { new: true },
    );
  }

  async getAllTaskLists(): Promise<TaskListDocument[]> {
    return await this.taskListModel.find();
  }

  async getById(id: string): Promise<TaskListDocument> {
    return await this.taskListModel.findOne({ _id: id });
  }

  async updateTask(dto: UpdateTaskDto): Promise<TaskListDocument> {
    return await this.taskListModel.findOneAndUpdate(
      { _id: dto.tasklistId, 'tasks.title': dto.title },
      {
        $set: {
          'tasks.$.content': dto.content,
          'tasks.$.isDone': dto.isDone,
          'tasks.$.title': dto.title,
        },
      },
      { new: true },
    );
  }

  async deleteTaskListById(id: string): Promise<TaskListDocument> {
    return await this.taskListModel.findOneAndDelete({ _id: id });
  }

  async deleteTaskById(dto: DeleteTaskDto): Promise<TaskListDocument> {
    return await this.taskListModel.findOneAndUpdate(
      { _id: dto.tasklistId },
      { $pull: { tasks: { title: dto.title } } },
      { new: true },
    );
  }
}
