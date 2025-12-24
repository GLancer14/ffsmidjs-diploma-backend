import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterUserDto, RequestUser } from 'src/users/types/dto/users';
import { AuthenticatedGuard } from './guards/local.authenticated.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthValidationPipe } from 'src/validation/auth.pipe';
import { registerValidationSchema } from 'src/validation/schemas/auth.joiSchema';
import { type Request } from 'express';

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  register(@Body() userData: RegisterUserDto) {
    return this.authService.register(userData);
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
