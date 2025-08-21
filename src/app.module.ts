import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDatabaseProviderModule } from './provider/mongo/mongo-provider.module';
import { UserAuthModule } from '@personal/user-auth';
import { AppConfigModule, HealthModule } from '@personal/common';

@Module({
  imports: [
    AppConfigModule,
    MongoDatabaseProviderModule,
    UserAuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
