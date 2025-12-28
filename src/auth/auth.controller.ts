import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterUserDto, RequestUser } from 'src/users/types/dto/users';
import { AuthenticatedGuard } from './guards/local.authenticated.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthValidationPipe } from 'src/validation/auth.pipe';
import { registerValidationSchema } from 'src/validation/schemas/auth.joiSchema';
import { type Request } from 'express';
import { loginUserValidationSchema } from 'src/validation/schemas/users.joiSchema';

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new AuthValidationPipe(loginUserValidationSchema))
  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  login(@Req() req: Request) {
    const user = req.user as RequestUser;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post("auth/logout")
  logout(@Req() req: Request) {
    return req.logout(err => {
      if (err) {
        throw new BadRequestException("Ошибка при выходе из учётной записи");
      }
    });
  }

  @UsePipes(new AuthValidationPipe(registerValidationSchema))
  @Post("auth/register")
  async register(
    @Body() userData: RegisterUserDto,
    @Req() req: Request,
  ) {
      try {
        const user = await this.authService.register(userData);
        if (!user) {
          throw new BadRequestException("Ошибка регистрации");
        }
      
        const sessionUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone || null,
        };
      
        await new Promise<void>((resolve, reject) => {
          req.login(sessionUser, (err) => {
            if (err) {
              reject(new UnauthorizedException("Ошибка авторизации после регистрации"));
            } else {
              resolve();
            }
          });
        });
      
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
          role: "client",
        };
      
      } catch (error) {
        if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
          throw error;
        }
        throw new BadRequestException("Ошибка регистрации");
      }
  }

  @UseGuards(AuthenticatedGuard)
  @Get("auth/me")
  loggedUser(@Req() req: Request) {
    const user = req.user as RequestUser;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }
}
