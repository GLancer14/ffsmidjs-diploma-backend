import { ID } from "src/types/commonTypes";
import { Role } from "../users";

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  contactPhone?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterUserResponseDto {
  id: ID;
  email: string;
  name: string;
}

export interface RequestUser {
  id: ID;
  email: string;
  name: string;
  contactPhone: string | null;
  role: string;
}

export type CreateUserDto = RegisterUserDto & { role: Role };
export type UpdateSelfDto = Partial<RegisterUserDto> & { id: ID };
