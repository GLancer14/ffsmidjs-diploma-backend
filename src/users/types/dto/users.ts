// export interface SignInUserDto {
//   email: string;
//   passwordHash: string;
//   name: string;
//   contactPhone: string;
//   role: string;
// }

import { ID } from "src/types/commonTypes";
import { Role } from "../users";

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RequestUser {
  id: ID;
  email: string;
  name: string;
  contactPhone: string;
  role: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role: Role;
}

// export interface SearchUserParams {
//   limit: number;
//   offset: number;
//   email: string;
//   name: string;
//   contactPhone: string;
// }

// export interface IUserService {
//   create(data: Partial<User>): Promise<User>;
//   findById(id: ID): Promise<User>;
//   findByEmail(email: string): Promise<User>;
//   findAll(params: SearchUserParams): Promise<User[]>;
// }

// export type Role = "client" | "admin" | "manager";