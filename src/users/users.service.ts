import { Injectable } from '@nestjs/common';
import bcrypt from "bcrypt";
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

  async create(data) {
    try {
      const { password, ...userWithoutPass } = data;
      const passwordHash = await bcrypt.hash(data.password, 10);
      const userWithHashedPass = {
        ...userWithoutPass,
        passwordHash,
      };

      const user = this.prisma.user.create({
        data: {
          ...userWithHashedPass
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
    const orCondition = [
      params.email ? { email: { contains: params.email } } : { email: undefined },
      params.name ? { name: { contains: params.name } } : { name: undefined },
      params.contactPhone ? { contactPhone: { contains: params.contactPhone } } : { contactPhone: undefined },
    ].filter(Boolean);

    return this.prisma.user.findMany({
      skip: +params.offset || undefined,
      take: +params.limit || undefined,
      where: orCondition.length !== 0 ? { OR: orCondition } : undefined,
    });
  }
}
