import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const errorStatus = exception.getStatus();

    response
      .status(errorStatus)
      .json({
        timestamp: new Date().toISOString(),
        status: "fail",
        data: exception.message,
        error: exception.name,
        code: errorStatus || 500,
      });
  }
}
