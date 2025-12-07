import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { type CreateUserDto } from './types/dto/users';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';

@Controller("api")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("admin/users/")
  @Roles("admin")
  async createUser(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
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

  @UseGuards(AuthenticatedGuard, RolesGuard)
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
