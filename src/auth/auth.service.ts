import { Injectable } from '@nestjs/common';
import bcrypt from "bcrypt";
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto, RegisterUserResponseDto, RequestUser } from 'src/users/types/dto/users';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<RequestUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const passwordIsMatch = await bcrypt.compare(password, user.passwordHash);
      if (passwordIsMatch) {
        const { passwordHash, ...userData } = user;

        return userData;
      }
    }

    return null;
  }

  async register(userData: RegisterUserDto): Promise<RegisterUserResponseDto | undefined> {
    const savedUser = await this.usersService.create(userData);

    if (savedUser) {
      const userForRegister = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        contactPhone: savedUser.contactPhone || null,
      };
      console.log(userForRegister)

      return userForRegister;
    }
  }
}
