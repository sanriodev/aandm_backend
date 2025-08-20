import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { MongoConfigModule } from '../../config/mongo/mongo-config.module';
import { MongoConfigService } from '../../config/mongo/mongo-config.service';
import { TaskModule } from '../../modules/tasklist/task.module';
import { NoteModule } from '../../modules/note/note.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule, TaskModule, NoteModule],
      useExisting: MongoConfigService,
    } as MongooseModuleAsyncOptions),
  ],
})
export class MongoDatabaseProviderModule {}
