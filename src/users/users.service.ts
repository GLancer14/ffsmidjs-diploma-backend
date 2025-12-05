import { Injectable } from '@nestjs/common';
import { IUserService, SearchUserParams } from './types/users';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import { PrismaPromise } from 'src/generated/prisma/internal/prismaNamespace';

const initialUser = {
  id: 0,
  email: "string",
  passwordHash: "string",
  name: "string",
  contactPhone: "string",
  role: "string",
}

@Injectable()
export class UsersService implements IUserService {
  constructor(private prisma: PrismaService) {}

  create(data) {
    return Promise.resolve(initialUser);
  }

  findById(id) {
    return Promise.resolve(initialUser);
  }

  findByEmail(email: string) {
    return Promise.resolve(initialUser);
  }

  findAll(params: SearchUserParams) {
    return this.prisma.user.findMany({
      skip: params.offset,
      take: params.limit,
      where: {
        email: {
          contains: params.email,
        },
        name: {
          contains: params.name,
        },
        contactPhone: {
          contains: params.contactPhone,
        },
      }
    });
  }
}
