import { Module } from '@nestjs/common';
import { BookRentalController } from './bookRental.controller';
import { BookRentalService } from './bookRental.service';

@Module({
  imports: [],
  controllers: [BookRentalController],
  providers: [BookRentalService],
})
export class BookRentalModule {}
