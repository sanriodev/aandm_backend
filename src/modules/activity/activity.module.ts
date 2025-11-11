import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { LoggerModule } from '@personal/common';
import { DBUserModule } from '../user/user.module';

@Module({
  imports: [LoggerModule, DBUserModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
