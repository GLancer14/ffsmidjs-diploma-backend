import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from './auth.service';
import type { RegisterUserDto } from 'src/users/types/dto/users';
import { Roles } from 'src/roles/roles.decorator';
import { AuthenticatedGuard } from './guards/local.authenticated.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  login(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.name,
      name: req.user.name,
      role: req.user.role,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post("auth/logout")
  logout(@Request() req) {
    return req.logout(err => {
      if (err) {
        throw new BadRequestException("Ошибка при выходе из учётной записи");
      }
    });
  }

  @Post("auth/register")
  register(@Body() userData: RegisterUserDto) {
    return this.authService.register(userData);
  }
}
