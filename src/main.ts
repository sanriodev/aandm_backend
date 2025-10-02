import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AppConfigService,
  ErrorFilter,
  MicroservicesService,
  RequestScopeInterceptor,
} from '@personal/common';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning();
  app.useGlobalFilters(new ErrorFilter());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector, {}));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const flatMessages: { p: string; msg: string }[] = [].concat(
          errors.map((e) => ({
            p: e.property,
            msg: generateErrorMessage(e),
          })),
        );
        return new BadRequestException({
          message: 'Bad Request',
          displayMessage: flatMessages.map((fm) => `${fm.msg}`).join('<br/>'),
        });
      },
    }),
  );

  const appConfig = app.get(AppConfigService);
  const microserviceService = app.get(MicroservicesService);

  app.useGlobalInterceptors(new RequestScopeInterceptor());
  const ENV = process.env.NODE_ENV;
  const swaggerEnabled = process.env.SWAGGER_ENABLED;
  if (swaggerEnabled == 'true' || swaggerEnabled == '1') {
    bootstrapSwagger(app, microserviceService);
  } else if (ENV != 'production' && ENV != 'prod') {
    bootstrapSwagger(app, microserviceService);
  }
  const port = appConfig.port || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

function generateErrorMessage(e): string {
  let ret = '';
  ret += e.constraints ? Object.values(e.constraints).join('<br/>') : '';
  if (e.children) {
    (e.children as any[]).forEach((child, i) => {
      if (e.constraints || i > 0) ret += '<br/>';
      ret += generateErrorMessage(child);
    });
  }
  return ret;
}

async function bootstrapSwagger(
  app: INestApplication,
  microserviceService: MicroservicesService,
) {
  const config = new DocumentBuilder()
    .setTitle('AandM')
    .setDescription('AandM API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(microserviceService.ingressUrl, 'Default Ingress')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
    extraModels: [],
  });

  SwaggerModule.setup('api/v1/doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      urls: microserviceService.swaggerURLs,
    },

    customSiteTitle: 'API Docs',
    explorer: true,
  } as unknown as any);
}

bootstrap();
