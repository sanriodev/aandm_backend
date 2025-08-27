import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DBUserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DBUserService],
  exports: [DBUserService],
})
export class DBUserModule {}
