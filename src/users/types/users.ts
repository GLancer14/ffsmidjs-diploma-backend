import { ID } from "src/types/commonTypes";
import { User } from 'src/generated/prisma/client';

export interface SearchUserParams {
  limit: number;
  offset: number;
  searchString: string;
  // email: string;
  // name: string;
  // contactPhone: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User | undefined>;
  findById(id: ID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(params: SearchUserParams): Promise<User[]>;
  // upsertAdmin(data: Partial<User>): Promise<User | undefined>;
}

export type Role = "client" | "admin" | "manager";