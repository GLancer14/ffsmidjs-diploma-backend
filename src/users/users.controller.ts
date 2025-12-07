import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { type CreateUserDto } from './types/dto/users';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller("api")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("admin/users/")
  @Roles("admin")
  async createUser(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("admin/users/")
  @Roles("admin")
  async getUsersForAdmin(
    @Req() req,
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("name") name: string,
    @Query("email") email: string,
    @Query("contactPhone") contactPhone: string,
  ) {
    console.log(req.user)
    return this.usersService.findAll({
      limit,
      offset,
      email,
      name,
      contactPhone,
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("manager/users/")
  @Roles("manager")
  async getUsersForManager(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("name") name: string,
    @Query("email") email: string,
    @Query("contactPhone") contactPhone: string,
  ) {
    return this.usersService.findAll({
      limit,
      offset,
      email,
      name,
      contactPhone,
    })
  }
}
