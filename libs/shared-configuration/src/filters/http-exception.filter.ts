import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { stringify } from '../helpers';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const content = exception.getResponse();

    Logger.warn(
      `Exception HTTP interceptée, status=${status}, request url=${request.url}, message=${stringify(content)}`,
      HttpExceptionFilter.name,
    );

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      content,
    });
  }
}
