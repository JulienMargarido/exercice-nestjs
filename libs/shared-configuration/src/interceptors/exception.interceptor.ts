import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  Type,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TimeoutError) {
          Logger.error(error, error.stack, ExceptionInterceptor.name);

          return throwError(() => new GatewayTimeoutException());
        }

        const expectedClientExceptions: Type<HttpException>[] = [
          BadRequestException,
          UnauthorizedException,
          ForbiddenException,
          NotFoundException,
          ConflictException,
          UnprocessableEntityException,
        ];
        const isExpectedClientException = expectedClientExceptions.some((exception) => error instanceof exception);
        if (isExpectedClientException) {
          Logger.warn(error.stack, ExceptionInterceptor.name);

          return throwError(() => error);
        }

        if (error instanceof HttpException) {
          Logger.error(error, error.stack, ExceptionInterceptor.name);

          return throwError(() => error);
        }

        Logger.error(error, error.stack, ExceptionInterceptor.name);

        return throwError(() => new InternalServerErrorException(error));
      }),
    );
  }
}
