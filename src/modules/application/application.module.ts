import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { AandmMailModule } from '../common/modules/mail/aandm-mail.module';

@Module({
  imports: [AandmMailModule],
  controllers: [ApplicationController],
  providers: [],
  exports: [],
})
export class ApplicationModule {}
