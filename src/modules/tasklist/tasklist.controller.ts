import {
  Get,
  Post,
  Controller,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  Body,
  UnprocessableEntityException,
  Param,
  Delete,
  Version,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import {
  JWTAuthGuard,
  JWTPayload,
  Permissions,
  PermissionsGuard,
  ReS,
  UserFromRequest,
} from '@personal/common';
import { TaskList } from './entity/tasklist.entity';
import { TaskListService } from './tasklist.service';
import { In } from 'typeorm';
import { Privacy } from '../common/enum/privacy.enum';

@Controller('task-list')
@ApiTags('task-list')
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
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:create')
  @ApiOperation({
    summary: 'create',
    description: 'create a new task-list',
  })
  @ApiBody({ type: CreateTaskListDto })
  async createTaskList(
    @Body() inputs: CreateTaskListDto,
    @UserFromRequest() user: JWTPayload,
  ): Promise<ReS<TaskList>> {
    try {
      if (!user.user.id) {
        throw new ForbiddenException('unauthenticated');
      }
      const dto = {
        ...inputs,
        userId: user.user.id,
        lastModifiedUserId: user.user.id,
      };
      dto['privacyMode'] = Privacy.Public;
      return ReS.FromData(await this.taskListService.create(dto));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:get:all')
  @ApiOperation({
    summary: 'get all',
    description: 'get all task-lists',
  })
  async getTaskLists(
    @UserFromRequest() user: JWTPayload,
  ): Promise<ReS<TaskList[]>> {
    if (!user.user.id) {
      throw new ForbiddenException('unauthenticated');
    }
    return ReS.FromData(
      await this.taskListService.findMany({
        where: [
          { userId: user.user.id },
          { privacyMode: In([Privacy.Public, Privacy.Protected]) },
        ],
        relations: ['tasks', 'user', 'lastModifiedUser'],
        order: { id: 'DESC' },
      }),
    );
  }

  @Get('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:get')
  @ApiOperation({
    summary: 'get a task-list',
    description: 'returns a task-list',
  })
  async getTaskList(
    @Param('id') id: number,
    @UserFromRequest() user: JWTPayload,
  ): Promise<ReS<TaskList>> {
    if (!user.user.id) {
      throw new ForbiddenException('unauthenticated');
    }
    return ReS.FromData(
      await this.taskListService.findOne({
        where: [
          { id, userId: user.user.id },
          { id, privacyMode: In([Privacy.Public, Privacy.Protected]) },
        ],
        relations: ['tasks', 'user', 'lastModifiedUser'],
      }),
    );
  }

  @Delete('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:delete')
  @ApiOperation({
    summary: 'delete a task-list',
    description: 'deletes a task-list',
  })
  async deleteTaskList(
    @Param('id') id: number,
    @UserFromRequest() user: JWTPayload,
  ): Promise<ReS<TaskList>> {
    if (!user.user.id) {
      throw new ForbiddenException('unauthenticated');
    }
    const entity = await this.taskListService.findOne({ where: { id } });
    if (!entity || entity.userId !== user.user.id) {
      throw new ForbiddenException(
        'Model not found or does not belong to user',
      );
    }
    return ReS.FromData(await this.taskListService.delete(id));
  }
}
