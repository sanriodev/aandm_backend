import { Injectable } from '@nestjs/common';
import {
  EventLogFilter,
  EventLoggerService,
  EventLogMessage,
} from '@personal/common';
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
    filterMode: 'own' | 'any',
    userId?: string,
  ): Promise<EventLogMessage<Task | TaskList | Note>[]> {
    let filter: EventLogFilter<any>;
    if (filterMode == 'own') {
      filter = {
        raw: {
          entityType: { $in: ['task', 'task_list', 'note'] },
          'user.id': +userId,
        },
      };
    } else if (filterMode == 'any') {
      const users = await this.userService.findAllByActivityPrivacy(true);
      const userIds = users.map((u) => u.id);

      filter = {
        raw: {
          entityType: { $in: ['task', 'task_list', 'note'] },
          'user.id': { $in: userIds },
        },
      };
    }

    return await this.eventlogService.retrieveLogs<Task | TaskList | Note>(
      filter,
    );
  }
}
