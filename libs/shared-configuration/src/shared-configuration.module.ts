import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { environmentConfig } from 'envs/api-environment';
import { TypedConfigService } from './environment';
import { HttpExceptionFilter } from './filters';
import { ExceptionInterceptor, LoggingInterceptor } from './interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/envs/${process.env.LOCAL_ENV === 'true' ? 'local' : 'production'}.env`,
      load: [environmentConfig],
    }),
  ],
  providers: [TypedConfigService, HttpExceptionFilter, ExceptionInterceptor, LoggingInterceptor],
  exports: [TypedConfigService, HttpExceptionFilter, ExceptionInterceptor, LoggingInterceptor],
})
export class SharedConfigurationModule {}
