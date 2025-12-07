import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from './auth.service';
import type { RegisterUserDto } from 'src/users/types/dto/users';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  login(@Request() req) {
    return this.authService.login({
      id: req.user.id,
      email: req.user.name,
      name: req.user.name,
      role: req.user.role,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("auth/logout")
  logout(@Request() req) {
    return req.logout();
  }

  @Post("auth/register")
  register(@Body() userData: RegisterUserDto) {
    return this.authService.register(userData);
  }
}
