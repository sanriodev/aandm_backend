import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { MongoConfigModule } from '../../config/mongo/mongo-config.module';
import { MongoConfigService } from '../../config/mongo/mongo-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useExisting: MongoConfigService,
    } as MongooseModuleAsyncOptions),
  ],
})
export class MongoDatabaseProviderModule {}
