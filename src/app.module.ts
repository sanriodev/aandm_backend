import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroserviceModule, UserAuthModule } from '@personal/user-auth';
import { AppConfigModule, HealthModule } from '@personal/common';
import { DatabaseProviderModule } from './provider/provider.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '@personal/user-auth/src/service/user.service';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      isGlobal: true,
    }),

    AppConfigModule,
    MicroserviceModule,
    UserAuthModule.registerAsync({
      inject: [UserService],
    }),
    // UserAuthModule.registerAsync({
    //   useFactory: (configService: DBUserService) => {
    //     return configService;
    //   },
    //   inject: [DBUserService],
    //   imports: [DBUserModule],
    // }),
    HealthModule,
    DatabaseProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
