import { Logger, ModuleMetadata, Type, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces';
import { fastify, FastifyInstance, FastifyServerOptions } from 'fastify';
import * as fs from 'node:fs';
import { TypedConfigService } from '../environment';
import { HttpExceptionFilter } from '../filters';
import { ExceptionInterceptor, LoggingInterceptor } from '../interceptors';
import { NestApp } from './nest-app.interface';

export interface BootstrapConfig {
  includePrefix: boolean;
  includeSwagger: boolean;
  includeFilters: boolean;
  includeInterceptors: boolean;
}

export async function bootstrapApp(module: Type<ModuleMetadata>, bootstrapConfig: BootstrapConfig): Promise<NestApp> {
  const serverOptions: FastifyServerOptions = {
    logger: false,
    ignoreTrailingSlash: true,
  };

  const instance: FastifyInstance = fastify(serverOptions);
  const adapter: FastifyAdapter = new FastifyAdapter(instance);
  const app = await NestFactory.create<NestFastifyApplication>(module, adapter);

  // Logs
  const envConfig = app.get(TypedConfigService);
  app.useLogger([envConfig.get('logLevel')]);
  Logger.log(`Version ${envConfig.get('version')}`, 'Bootstrap');
  Logger.log(`Environnement de production: ${envConfig.get('production')}`, 'Bootstrap');
  Logger.log(`Niveau de log: ${envConfig.get('logLevel')}`, 'Bootstrap');
  Logger.log(`Préfixe API: ${envConfig.get('serverPrefix')}`, 'Bootstrap');

  // Configurations
  app.enableCors();
  if (bootstrapConfig.includePrefix) {
    app.setGlobalPrefix(envConfig.get('serverPrefix'));
  }

  // Filtres, Intercepteurs et Validator
  configGlobalLayers(app, bootstrapConfig);

  // Document de configuration OpenAPI/Swagger
  if (bootstrapConfig.includeSwagger) {
    configSwagger(app, envConfig);
  }

  await app.init();

  return { app, instance };
}

function configGlobalLayers(app: NestFastifyApplication, bootstrapConfig: BootstrapConfig) {
  if (bootstrapConfig.includeInterceptors) {
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new ExceptionInterceptor());
  }

  if (bootstrapConfig.includeFilters) {
    app.useGlobalFilters(new HttpExceptionFilter());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}

function configSwagger(app: NestFastifyApplication, config: TypedConfigService) {
  // Swagger
  const openApiObj = new DocumentBuilder()
    .setTitle(config.get('apiTitle'))
    .setDescription(config.get('apiDescription'))
    .setVersion(config.get('version'))
    .setExternalDoc(config.get('apiDoc'), config.get('apiDoc'))
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, openApiObj);
  const swaggerConfig: SwaggerCustomOptions = {
    url: 'swagger',
    jsonDocumentUrl: 'swagger/json',
    useGlobalPrefix: true,
  };
  if (!config.get('production')) {
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(swaggerDocument, null, ' '));
  }

  SwaggerModule.setup('swagger', app, swaggerDocument, swaggerConfig);
}
