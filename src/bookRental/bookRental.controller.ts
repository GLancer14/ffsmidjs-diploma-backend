import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { BookRentalService } from './bookRental.service';
import { type BookRentalDto } from './types/dto/bookRental';
import { BookRental } from 'src/generated/prisma/client';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { BookRentalValidationPipe } from 'src/validation/bookRental.pipe';
import { rentBookValidationSchema } from 'src/validation/schemas/bookRental.joiSchema';
import { type Request } from 'express';
import { RequestUser } from 'src/users/types/dto/users';
// import { BookRental } from './types/bookRental';

@Controller("api")
export class BookRentalController {
  constructor(private readonly bookRentalService: BookRentalService) {}

  @Post("client/rentals")
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UsePipes(new BookRentalValidationPipe(rentBookValidationSchema))
  @Roles("client")
  rentBook(
    @Body() bookRentData: BookRentalDto,
    @Req() req: Request
  ): Promise<BookRental> {
    const user = req.user as RequestUser;
    return this.bookRentalService.rentBook({
      ...bookRentData,
      userId: user.id,
    });
  }
}
