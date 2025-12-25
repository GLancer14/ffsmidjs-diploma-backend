import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from "bcrypt";
import { IUserService, SearchUserParams } from './types/users';
import { PrismaService } from 'src/prisma/prisma.service';
import { ID } from 'src/types/commonTypes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { CreateUserDto, RegisterUserDto, UpdateUserDto } from './types/dto/users';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async create(data: RegisterUserDto): Promise<User | undefined> {
    try {
      const { password, ...userWithoutPass } = data;
      const passwordHash = await bcrypt.hash(data.password, 10);
      const userWithHashedPass = {
        ...userWithoutPass,
        passwordHash,
      };

      const user = await this.prisma.user.create({
        data: { ...userWithHashedPass },
      });

      const requestCreationTime = new Date();
      await this.prisma.supportRequest.create({
        data: {
          user: user.id,
          createdAt: requestCreationTime,
        },
      });

      return user;
    } catch(e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new BadRequestException("Пользователь с таким email уже существует");
      }

      throw new InternalServerErrorException("Ошибка сервера");
    }
  }

  findById(id: ID): Promise<User | null> {

    console.log(id)
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async updateUser(params: Partial<UpdateUserDto>): Promise<User | null> {
    let passwordHash: string | null = null;

    if (params.password) {
      passwordHash = await bcrypt.hash(params.password, 10);
    }

    const dataForUpdate = {
      email: params.email || undefined,
      name: params.name || undefined,
      contactPhone: params.contactPhone || undefined,
      passwordHash: passwordHash || undefined,
    };
    
    return this.prisma.user.update({
      where: {
        id: params.id,
      },
      data: dataForUpdate,
    });
  }

  async deleteUser(userId: ID): Promise<User | null> {
    await this.prisma.bookRental.deleteMany({
      where: {
        userId
      }
    });

    const deletedUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    if (deletedUser) {
      await this.prisma.bookRental.deleteMany({
        where: {
          userId: deletedUser.id,
        },
      })
    }
    
    return deletedUser;
  }

  findAll(params: SearchUserParams): Promise<User[]> {
    let orCondition;
    if (params) {
      orCondition = [
        { email: { contains: params.searchString } },
        { name: { contains: params.searchString } },
        { contactPhone: { contains: params.searchString } },
      ];
    }
    
    // const andCondition = [
    //   params.email ? { email: { contains: params.email } } : { email: undefined },
    //   params.name ? { name: { contains: params.name } } : { name: undefined },
    //   params.contactPhone ? { contactPhone: { contains: params.contactPhone } } : { contactPhone: undefined },
    // ].filter(Boolean);

    return this.prisma.user.findMany({
      skip: params.offset || undefined,
      take: params.limit || undefined,
      // where: andCondition.length !== 0 ? { AND: andCondition } : undefined,
      where: orCondition.length !== 0 ? { OR: orCondition } : undefined,
    });
  }

  getUsersCount(params: { searchString: string }): Promise<number> {
    let orCondition;
    if (params) {
      orCondition = [
        { email: { contains: params.searchString } },
        { name: { contains: params.searchString } },
        { contactPhone: { contains: params.searchString } },
      ];
    }

    return this.prisma.user.count({
      where: orCondition.length !== 0 ? { OR: orCondition } : undefined,
    });
  }

  async getUsersCountForWelcome() {
    const allUsers = await this.prisma.user.count();
    const usersWithActiveRents = (await this.prisma.bookRental.groupBy({
      by: ["userId"],
      where: {
        status: "active",
      },
      _count: {
        userId: true,
      }
    })).length;

    const newMessages = await this.prisma.message.count({
      where: {
        readAt: null
      }
    });

    return {allUsers, usersWithActiveRents, newMessages};
  }
}
