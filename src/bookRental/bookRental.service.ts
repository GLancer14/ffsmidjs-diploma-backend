import { Injectable } from '@nestjs/common';
import { BookRental, IBookRentalService, SearchBookRentalParams } from './types/bookRental';
import { ID } from 'src/types/commonTypes';

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
export class BookRentalService implements IBookRentalService {
  rentBook(data: Partial<BookRental>) {
    return Promise.resolve(initialBookRental);
  }

  delete(id: ID) {
    return Promise.resolve(initialBookRental);
  }

  findById(id: ID) {
    return Promise.resolve(initialBookRental);
  }

  findAll(params: SearchBookRentalParams) {
    return Promise.resolve([initialBookRental]);
  }
}
