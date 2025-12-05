import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { type CreateUserDto } from './types/dto/users';
import { Roles } from 'src/roles/roles.decorator';

@Controller("api")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("admin/users/")
  @Roles("admin")
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Get("admin/users/")
  @Roles("admin")
  getUsersForAdmin(
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

  @Get("manager/users/")
  @Roles("manager")
  getUsersForManager(
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
