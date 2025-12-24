import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException
} from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception)
    
    switch (exception.code) {
      case 'P2002':
        throw new BadRequestException("Пользователь с таким значением уникального поля уже существует.");
      case 'P2025':
        throw new BadRequestException("Запись не найдена в базе данных.");
      default:
        throw new InternalServerErrorException("Ошибка базы данных.");
    }
  }
}