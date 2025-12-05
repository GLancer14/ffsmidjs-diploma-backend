import { PrismaPromise } from "src/generated/prisma/internal/prismaNamespace";
import { ID } from "src/types/commonTypes";
import { User } from 'src/generated/prisma/client';

// export interface User {
//   email: string;
//   passwordHash: string;
//   name: string;
//   contactPhone: string;
//   role: string;
// }

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): PrismaPromise<User[]>;
}

export type Role = "client" | "admin" | "manager";