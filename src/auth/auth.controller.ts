import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from './auth.service';
import type { RegisterUserDto } from 'src/users/types/dto/users';
import { Role } from 'src/roles/roles.decorator';

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  login(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("local"))
  @Post("auth/logout")
  logout(@Request() req) {
    return req.logout();
  }

  @Post("auth/register")
  @Role("client")
  register(@Body() userData: RegisterUserDto) {
    return this.authService.register(userData);
  }
}
