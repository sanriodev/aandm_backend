import {
  Get,
  Controller,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  Version,
  ForbiddenException,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  EventLogMessage,
  JWTAuthGuard,
  JWTPayload,
  Permissions,
  PermissionsGuard,
  ReS,
  UserFromRequest,
} from '@personal/common';
import { Note } from '../note/entity/note.entity';
import { TaskList } from '../tasklist/entity/tasklist.entity';
import { Task } from '../task/entity/task.entity';
import { ActivityService } from './activity.service';
import { User } from '../user/entity/user.entity';
import { DBUserService } from '../user/user.service';

@Controller('activity')
@ApiTags('activity')
@UseGuards(PermissionsGuard)
@UseGuards(JWTAuthGuard)
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class ActivityController {
  constructor(
    @Inject(ActivityService)
    private readonly activityService: ActivityService,
    @Inject(DBUserService)
    private readonly userService: DBUserService,
  ) {}

  @Get('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('activity:get:all')
  @ApiOperation({
    summary: 'get all activity',
    description: 'returns all activity based on filter',
  })
  @ApiQuery({
    name: 'filterMode',
    required: false,
    description: "'own' to get own activity, 'any' to get all public activity",
  })
  async getActivity(
    @UserFromRequest() user: JWTPayload,
    @Query('filterMode') filterMode: 'own' | 'any' = 'own',
  ): Promise<ReS<EventLogMessage<Task | TaskList | Note>[]>> {
    if (!user.user.id) {
      throw new ForbiddenException('unauthenticated');
    }
    return ReS.FromData(
      await this.activityService.getActivity(filterMode, user.user.id),
    );
  }

  @Patch('/public-activity')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('user:update:own')
  @ApiOperation({
    summary: 'update own user',
    description: 'update own user activity privacy settings',
  })
  async changePublicActivityMode(
    @UserFromRequest() user: JWTPayload,
    @Query('publicActivity') publicActivity: boolean = false,
  ): Promise<ReS<User>> {
    if (!user.user.id) {
      throw new ForbiddenException('unauthenticated');
    }
    return ReS.FromData(
      await this.userService.updateActivitySetting(
        publicActivity,
        user.user.id,
      ),
    );
  }
}
