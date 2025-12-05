import { Injectable } from '@nestjs/common';
import { IUserService, SearchUserParams } from './types/users';
import { PrismaService } from 'src/prisma/prisma.service';
import { ID } from 'src/types/commonTypes';

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
    try {
      const user = this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash: data.passwordHash,
          contactPhone: data.contactPhone,
          role: data.role,
        }
      });

      return user;
    } catch(e) {
      console.log(e)
    }
    
  }

  findById(id: ID) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
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
