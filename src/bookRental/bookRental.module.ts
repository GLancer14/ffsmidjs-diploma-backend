import { Module } from '@nestjs/common';
import { BookRentalController } from './bookRental.controller';
import { BookRentalService } from './bookRental.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [BookRentalController],
  providers: [BookRentalService, PrismaService],
})
export class BookRentalModule {}
