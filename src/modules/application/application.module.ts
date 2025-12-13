import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { AandmMailModule } from '../common/modules/mail/aandm-mail.module';
import { DBUserModule } from '../user/user.module';
import { ApplicationService } from './application-service';

@Module({
  imports: [AandmMailModule, DBUserModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
