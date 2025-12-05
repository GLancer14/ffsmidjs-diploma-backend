import { ID } from "src/types/commonTypes";
import { BookRentalDto } from "./dto/bookRental";
import { BookRental } from "src/generated/prisma/client";

export type RentalStatus = "reserved" | "active" | "completed" | "cancelled"

// export interface BookRental {
//   id: number;
//   userId: ID;
//   libraryId: ID;
//   bookId: ID;
//   dateStart: Date;
//   dateEnd: Date;
//   status: RentalStatus;
//   // createdAt: Date;
//   // updatedAt: Date;
// }

export interface SearchBookRentalParams {
  dateStart: Date;
  dateEnd: Date;
  status: RentalStatus;
}

export interface IBookRentalService {
  rentBook(data: BookRentalDto): Promise<BookRental>;
  // delete(id: ID): Promise<BookRental>
  // findById(id: ID): Promise<BookRental>;
  // findAll(params: SearchBookRentalParams): Promise<BookRental[]>;
}
