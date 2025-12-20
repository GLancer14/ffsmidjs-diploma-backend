import { ID } from "src/types/commonTypes";

export type RentalStatus = "reserved" | "active" | "completed" | "cancelled"

export interface BookRentalDto {
  libraryId: number;
  bookId: number;
  dateStart: string;
  dateEnd: string;
}

export interface BookRentalResponseDto {
  id: ID;
  userId: ID;
  library: {
    name?: string;
    address?: string;
  };
  book: {
    title?: string;
    author?: string;
  };
  dateStart: Date;
  dateEnd: Date;
  status: string;
}

// export interface SearchBookRentalParams {
//   dateStart: Date;
//   dateEnd: Date;
//   status: RentalStatus;
// }

// export interface IBookRentalService {
//   rentBook(data: Partial<BookRental>): Promise<BookRental>;
//   delete(id: ID): Promise<BookRental>
//   findById(id: ID): Promise<BookRental>;
//   findAll(params: SearchBookRentalParams): Promise<BookRental[]>;
// }
