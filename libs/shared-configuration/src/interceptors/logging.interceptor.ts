import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const logTime = `${request.raw.method} ${request.raw.url} took ${Date.now() - now}ms`;
        Logger.log(logTime, LoggingInterceptor.name);
      }),
    );
  }
}
