import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from "bcrypt";
import { BookRental, IBookRentalService, SearchBookRentalParams } from './types/auth';
import { ID } from 'src/types/commonTypes';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from 'src/users/types/dto/users';

const initialBookRental: BookRental = {
  id: 0,
  userId: 0,
  libraryId: 0,
  bookId: 0,
  dateStart: new Date(),
  dateEnd: new Date(),
  status: "reserved",
  cretedAt: new Date(),
  updatedAt: new Date(),
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
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

  async register(userData: RegisterUserDto) {
    const { password, ...userWithoutPass } = userData;
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const userWithHashedPass = {
      ...userWithoutPass,
      passwordHash,
    };

    const savedUser = await this.usersService.create(userWithHashedPass);

    return {
      id: savedUser?.id,
      email: savedUser?.email,
      name: savedUser?.name,
    }
  }
}
