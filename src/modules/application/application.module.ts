import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { AandmMailModule } from '../common/modules/mail/aandm-mail.module';
import { DBUserModule } from '../user/user.module';

@Module({
  imports: [AandmMailModule, DBUserModule],
  controllers: [ApplicationController],
  providers: [],
  exports: [],
})
export class ApplicationModule {}
