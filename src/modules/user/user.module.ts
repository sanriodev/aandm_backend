import { Module } from '@nestjs/common';
import { DBUserService } from 'src/services/user/user.service';
import { AppConfigModule } from './app-config.module';
import { DatabaseModule } from './database/database.module';
import { MailServiceModule } from './mail-service.module';
import { DBRoleModule } from './role.module';
@Module({
  imports: [DatabaseModule, DBRoleModule, AppConfigModule, MailServiceModule],
  providers: [DBUserService],
  exports: [DBUserService],
})
export class DBUserModule {}
