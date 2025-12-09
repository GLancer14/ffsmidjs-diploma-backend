import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from "bcrypt";
import { IUserService, SearchUserParams } from './types/users';
import { PrismaService } from 'src/prisma/prisma.service';
import { ID } from 'src/types/commonTypes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { RegisterUserDto } from './types/dto/users';
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

      return user;
    } catch(e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new BadRequestException("Пользователь с таким email уже существует");
      }

      throw new InternalServerErrorException("Ошибка сервера");
    }
  }

  findById(id: ID): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  findAll(params: SearchUserParams): Promise<User[]> {
    const andCondition = [
      params.email ? { email: { contains: params.email } } : { email: undefined },
      params.name ? { name: { contains: params.name } } : { name: undefined },
      params.contactPhone ? { contactPhone: { contains: params.contactPhone } } : { contactPhone: undefined },
    ].filter(Boolean);

    return this.prisma.user.findMany({
      skip: +params.offset || undefined,
      take: +params.limit || undefined,
      where: andCondition.length !== 0 ? { AND: andCondition } : undefined,
    });
  }
}
