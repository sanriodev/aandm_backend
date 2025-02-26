import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ReE } from '../res.model';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode: number =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message;
    console.error(error);
    if (error instanceof HttpException) {
      const errorMessage = (error.getResponse() as any)?.message;
      message = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
    } else {
      message = [error.message];
    }

    const name =
      error instanceof HttpException
        ? (error.getResponse() as any)?.error || error.name
        : error.name;

    const responseWithStatusCode = response.status(statusCode);
    const errorPayload = ReE.FromData(statusCode, name, message);
    // watch out for fastify
    if (typeof responseWithStatusCode.json === 'undefined') {
      responseWithStatusCode.send(errorPayload);
    } else {
      responseWithStatusCode.json(errorPayload);
    }
  }
}
