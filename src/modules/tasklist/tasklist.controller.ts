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
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import { JWTAuthGuard, PermissionsGuard, ReS } from '@personal/common';
import { TaskList } from './entity/tasklist.entity';
import { TaskListService } from './tasklist.service';

@Controller('task')
@ApiTags('task')
@UseGuards(PermissionsGuard)
@UseGuards(JWTAuthGuard)
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class TaskListController {
  constructor(
    @Inject(TaskListService)
    private readonly taskListService: TaskListService,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: 'create taskList',
    description: 'creates a new taskList',
  })
  @ApiBody({ type: CreateTaskListDto })
  async createTaskList(
    @Body() inputs: CreateTaskListDto,
  ): Promise<ReS<TaskList>> {
    try {
      return ReS.FromData(await this.taskListService.create(inputs));
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
  async getTaskLists(): Promise<ReS<TaskList[]>> {
    return ReS.FromData(
      await this.taskListService.findMany({ relations: ['tasks'] }),
    );
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get a taskList',
    description: 'returns a taskList',
  })
  async getTaskList(@Param('id') id: number): Promise<ReS<TaskList>> {
    return ReS.FromData(await this.taskListService.findOne(id, []));
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'delete a taskList',
    description: 'deletes a taskList',
  })
  async deleteTaskList(@Param('id') id: number): Promise<ReS<TaskList>> {
    return ReS.FromData(await this.taskListService.delete(id));
  }
}
