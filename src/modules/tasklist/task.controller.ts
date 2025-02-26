import {
  Get,
  Post,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  Body,
  UnprocessableEntityException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReS } from '../../common/res.model';
import { TaskService } from './task.service';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { TaskListDto } from './dto/tasklist.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Controller('task')
@ApiTags('task')
@UseGuards()
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class TaskController {
  constructor(
    @Inject(TaskService)
    private readonly taskService: TaskService,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: 'create taskList',
    description: 'creates a new taskList',
  })
  @ApiBody({ type: CreateTaskListDto })
  async createTaskList(
    @Body() inputs: CreateTaskListDto,
  ): Promise<ReS<TaskListDto>> {
    try {
      return ReS.FromData(await this.taskService.createTaskList(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Post('/task')
  @ApiOperation({
    summary: 'create task',
    description: 'creates a new task',
  })
  @ApiBody({ type: CreateTaskDto })
  async createTask(@Body() inputs: CreateTaskDto): Promise<ReS<TaskListDto>> {
    try {
      return ReS.FromData(await this.taskService.createTask(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get all taskLists',
    description: 'returns all taskLists',
  })
  async getTaskLists(): Promise<ReS<TaskListDto[]>> {
    return ReS.FromData(await this.taskService.getAllTaskLists());
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get a taskList',
    description: 'returns a taskList',
  })
  async getTaskList(@Param('id') id: string): Promise<ReS<TaskListDto>> {
    return ReS.FromData(await this.taskService.getById(id));
  }

  @Patch('/task')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'update task',
    description: 'updates a task',
  })
  async updateTask(@Body() dto: UpdateTaskDto): Promise<ReS<TaskListDto>> {
    return ReS.FromData(await this.taskService.updateTask(dto));
  }

  @Delete('/task')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'delete a task',
    description: 'deletes a task',
  })
  async deleteTask(@Body() dto: DeleteTaskDto): Promise<ReS<TaskListDto>> {
    return ReS.FromData(await this.taskService.deleteTaskById(dto));
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'delete a taskList',
    description: 'deletes a taskList',
  })
  async deleteTaskList(@Param('id') id: string): Promise<ReS<TaskListDto>> {
    return ReS.FromData(await this.taskService.deleteTaskListById(id));
  }
}
