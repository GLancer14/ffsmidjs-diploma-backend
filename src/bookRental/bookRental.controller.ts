import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookRentalService } from './bookRental.service';
import { type BookRentalDto } from './types/dto/bookRental';
import { BookRental } from './types/bookRental';

@Controller("api")
export class BookRentalController {
  constructor(private readonly bookRentalService: BookRentalService) {}

  @Post("client/rentals")
  rentBook(@Body() bookRentData: BookRentalDto): Promise<BookRental> {
    return this.bookRentalService.rentBook(bookRentData);
  }
}
