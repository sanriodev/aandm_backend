import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@personal/user-auth';
import { DBUserService } from './user.service';
import { DBRoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DBRoleModule],
  providers: [DBUserService],
  exports: [DBUserService],
})
export class DBUserModule {}
