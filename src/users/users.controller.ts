import { Body, Controller, Get, Post, Put, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, RequestUser } from './types/dto/users';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { UsersValidationPipe } from 'src/validation/users.pipe';
import { createUserValidationSchema, findUserValidationSchema, updateUserValidationSchema } from 'src/validation/schemas/users.joiSchema';
import { type SearchUserParams } from './types/users';
import { ClientIdCheckGuard } from 'src/supportChat/guards/clientCheck.guard';
import type { Request } from 'express';

@Controller("api")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new UsersValidationPipe(createUserValidationSchema))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("admin/users/")
  @Roles("admin")
  async createUser(@Body() user: CreateUserDto) {
    const createdUser = await this.usersService.create(user);
    return {
      id: createdUser?.id,
      email: createdUser?.email,
      name: createdUser?.name,
      role: createdUser?.role,
    };
  };

  @UsePipes(new UsersValidationPipe(updateUserValidationSchema))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put("self/users")
  async updateSelf(
    @Req() req: Request,
    @Body() user: Partial<CreateUserDto>
  ) {
    const userFromSession = req.user as RequestUser;
    const updatedUser = await this.usersService.updateSelf({
      ...user,
      id: userFromSession.id,
    });
    console.log(updatedUser)

    if (updatedUser) {
      return {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        name: updatedUser[0].name,
        contactPhone: updatedUser[0].contactPhone,
        role: updatedUser[0].role,
      };
    }
  };

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("admin/users/")
  @Roles("admin")
  async getUsersForAdmin(
    @Query(
      new UsersValidationPipe(findUserValidationSchema)
    ) query: SearchUserParams
  ) {
    return this.usersService.findAll({
      limit: query.limit,
      offset: query.offset,
      email: query.email,
      name: query.name,
      contactPhone: query.contactPhone,
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("manager/users/")
  @Roles("manager")
  async getUsersForManager(
    @Query(
      new UsersValidationPipe(findUserValidationSchema)
    ) query: SearchUserParams
  ) {
    return this.usersService.findAll({
      limit: query.limit,
      offset: query.offset,
      email: query.email,
      name: query.name,
      contactPhone: query.contactPhone,
    });
  }
}
