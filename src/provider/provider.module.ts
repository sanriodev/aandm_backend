import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlConfigModule } from '../config/database/config.module';
import { SqlConfigService } from '../config/database/config.service';

const entityModules = [];

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
