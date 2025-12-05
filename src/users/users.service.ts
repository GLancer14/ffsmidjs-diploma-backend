import { Injectable } from '@nestjs/common';
import { IUserService, SearchUserParams } from './types/users';

const initialUser = {
  email: "string",
  passwordHash: "string",
  name: "string",
  contactPhone: "string",
  role: "string",
}

@Injectable()
export class UsersService implements IUserService {
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
    return Promise.resolve([initialUser]);
  }
}
