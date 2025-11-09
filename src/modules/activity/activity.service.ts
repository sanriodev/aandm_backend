import { Injectable } from '@nestjs/common';
import {
  EventLogFilter,
  EventLoggerService,
  EventLogMessage,
  UserService,
} from '@personal/common';
import { ActivityFilterDto } from './dto/activity-filter.dto';
import { Task } from '../task/entity/task.entity';
import { TaskList } from '../tasklist/entity/tasklist.entity';
import { Note } from '../note/entity/note.entity';
import { DBUserService } from '../user/user.service';

@Injectable()
export class ActivityService {
  constructor(
    private readonly eventlogService: EventLoggerService,
    private readonly userService: DBUserService,
  ) {}

  async getActivity(
    filterParams: ActivityFilterDto,
    userId?: string,
  ): Promise<EventLogMessage<Task | TaskList | Note>[]> {
    let filter: EventLogFilter<any>;
    if (filterParams.mode == 'own') {
      filter = {
        raw: {
          user: {
            id: userId?.toString(),
          },
          take: filterParams.limit,
        },
      };
    } else if (filterParams.mode == 'any') {
      const users = await this.userService.findAllByActivityPrivacy(true);
      const userIds = users
        .map((u) => u.id?.toString())
        .filter((id): id is string => !!id);

      filter = {
        raw: {
          user: {
            id: { $in: userIds },
          },
          take: filterParams.limit,
        },
      };
    }

    return await this.eventlogService.retrieveLogs<Task | TaskList | Note>(
      filter,
    );
  }
}
