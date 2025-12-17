import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { BookRentalService } from './bookRental.service';
import { type BookRentalDto } from './types/dto/bookRental';
import { BookRental } from 'src/generated/prisma/client';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { BookRentalValidationPipe } from 'src/validation/bookRental.pipe';
import { findRentValidationSchema, rentBookValidationSchema } from 'src/validation/schemas/bookRental.joiSchema';
import { type Request } from 'express';
import { RequestUser } from 'src/users/types/dto/users';
import { ID } from 'src/types/commonTypes';
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

  @Get("client/rentals")
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles("client")
  findRents(
    @Req() req: Request
  ): Promise<BookRental[]> {
    const user = req.user as RequestUser;
    return this.bookRentalService.findAll(user.id);
  }

  @Get("client/rentals/:id")
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles("client")
  findRent(
    @Param(new BookRentalValidationPipe(findRentValidationSchema)) params: { id: ID },
    @Req() req: Request
  ): Promise<BookRental | null> {
    return this.bookRentalService.findById(params.id);
  }
}
