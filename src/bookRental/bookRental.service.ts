import { Injectable } from '@nestjs/common';
import { IBookRentalService } from './types/bookRental';
import { ID } from 'src/types/commonTypes';
import { BookRentalDto } from './types/dto/bookRental';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookRental } from 'src/generated/prisma/client';

// const initialBookRental: BookRental = {
//   id: 0,
//   userId: 0,
//   libraryId: 0,
//   bookId: 0,
//   dateStart: new Date(),
//   dateEnd: new Date(),
//   status: "reserved",
//   // createdAt: new Date(),
//   // updatedAt: new Date(),
// }

@Injectable()
export class BookRentalService implements IBookRentalService {
  constructor(private prisma: PrismaService) {}

  async rentBook(data: BookRentalDto & { userId: ID }): Promise<BookRental> {
    const bookRentRecord = await this.prisma.bookRental.create({
      data: {
        userId: data.userId,
        libraryId: data.libraryId,
        bookId: data.bookId,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
      }
    });

    return bookRentRecord;
  }

  // delete(id: ID) {
  //   return Promise.resolve(initialBookRental);
  // }

  // findById(id: ID) {
  //   return Promise.resolve(initialBookRental);
  // }

  // findAll(params: SearchBookRentalParams) {
  //   return Promise.resolve([initialBookRental]);
  // }
}
