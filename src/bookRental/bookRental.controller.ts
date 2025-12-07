import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BookRentalService } from './bookRental.service';
import { type BookRentalDto } from './types/dto/bookRental';
import { BookRental } from 'src/generated/prisma/client';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
// import { BookRental } from './types/bookRental';

@Controller("api")
export class BookRentalController {
  constructor(private readonly bookRentalService: BookRentalService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("client/rentals")
  @Roles("client")
  rentBook(
    @Body() bookRentData: BookRentalDto,
    @Req() req
  ): Promise<BookRental> {
    return this.bookRentalService.rentBook({
      ...bookRentData,
      userId: req.user.id
    });
  }
}
