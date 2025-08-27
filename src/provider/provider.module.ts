import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlConfigModule } from '../config/database/config.module';
import { SqlConfigService } from '../config/database/config.service';
import { TaskModule } from '../modules/task/task.module';
import { TaskListModule } from '../modules/tasklist/tasklist.module';
import { NoteModule } from '../modules/note/note.module';
import { DBRoleModule } from '../modules/role/role.module';
import { DBUserModule } from '../modules/user/user.module';

const entityModules = [
  TaskModule,
  TaskListModule,
  NoteModule,
  DBRoleModule,
  DBUserModule,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SqlConfigModule],
      inject: [SqlConfigService],
      useFactory: (configService: SqlConfigService) =>
        configService.TypeOrmModuleOptions,
    }),
    ...entityModules,
  ],
  providers: [],
  exports: [...entityModules],
})
export class DatabaseProviderModule {}
