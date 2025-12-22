import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, RequestUser, UpdateUserDto } from './types/dto/users';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { UsersValidationPipe } from 'src/validation/users.pipe';
import {
  createUserValidationSchema,
  findUserValidationSchema,
  getUsersCountValidationSchema,
  updateAnotherUserValidationSchema,
  updateUserValidationSchema,
} from 'src/validation/schemas/users.joiSchema';
import { type SearchUserParams } from './types/users';
import { ClientIdCheckGuard } from 'src/supportChat/guards/clientCheck.guard';
import type { Request } from 'express';
import { idValidationSchema } from 'src/validation/schemas/common.joiSchema';
import { type ID } from 'src/types/commonTypes';

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
  @UseGuards(AuthenticatedGuard)
  @Put("self/users")
  async updateSelf(
    @Req() req: Request,
    @Body() user: Partial<CreateUserDto>
  ) {
    const userFromSession = req.user as RequestUser;
    const updatedUser = await this.usersService.updateUser({
      ...user,
      id: userFromSession.id,
    });

    if (updatedUser) {
      return {
        email: updatedUser.email,
        name: updatedUser.name,
        contactPhone: updatedUser.contactPhone,
        role: updatedUser.role,
      };
    }
  };

  @UsePipes(new UsersValidationPipe(updateAnotherUserValidationSchema))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles("admin")
  @Put("admin/users")
  async updateUser(
    @Body() user: Partial<UpdateUserDto>
  ) {
    const updatedUser = await this.usersService.updateUser(user);

    if (updatedUser) {
      return {
        email: updatedUser.email,
        name: updatedUser.name,
        contactPhone: updatedUser.contactPhone,
        role: updatedUser.role,
      };
    }
  };

  @UsePipes(new UsersValidationPipe(idValidationSchema))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles("admin")
  @Delete("admin/users")
  async deleteUser(
    @Body() user: { id: ID }
  ) {
    return this.usersService.deleteUser(user.id);
  };

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("admin/users/")
  @Roles("admin")
  async getUsersForAdmin(
    @Query(
      new UsersValidationPipe(findUserValidationSchema)
    ) query: SearchUserParams
  ) {
    const users = await this.usersService.findAll({
      limit: query.limit,
      offset: query.offset,
      searchString: query.searchString,
      // email: query.email,
      // name: query.name,
      // contactPhone: query.contactPhone,
    })

    const usersWithoutPasswords = users.map(user => {
      const { passwordHash, ...filteredUser } = user;
      return filteredUser;
    });

    return usersWithoutPasswords;
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("common/users/:id")
  @Roles("admin", "manager")
  async getUserById(
    @Param(
      new UsersValidationPipe(idValidationSchema)
    ) params: { id: ID }
  ) {
    return this.usersService.findById(params.id);
  }

  @Get("common/users-count")
  getUsersCount(
    @Query(
      new UsersValidationPipe(getUsersCountValidationSchema)
    ) query: { searchString: string }
  ) {
    return this.usersService.getUsersCount(query);
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  // @Get("manager/users/")
  // @Roles("manager")
  // async getUsersForManager(
  //   @Query(
  //     new UsersValidationPipe(findUserValidationSchema)
  //   ) query: SearchUserParams
  // ) {
  //   return this.usersService.findAll({
  //     limit: query.limit,
  //     offset: query.offset,
  //     email: query.email,
  //     name: query.name,
  //     contactPhone: query.contactPhone,
  //   });
  // }
}
