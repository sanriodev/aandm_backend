import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';

@Module({
  imports: [AandmMailModule],
  controllers: [ApplicationController],
  providers: [],
  exports: [],
})
export class ApplicationModule {}
