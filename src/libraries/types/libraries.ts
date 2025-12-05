import { Book, Library } from "src/generated/prisma/client";
import { ID } from "src/types/commonTypes";

// export interface Book {
//   libraryId: number;
//   title: string;
//   author: string;
//   year: number;
//   description: string;
//   coverImage: Express.Multer.File | null;
//   isAvailable: boolean;
//   totalCopies: number;
//   availableCopies: number;
// }

// export interface Library {
//   name: string;
//   address: string;
//   description: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface SearchBookParams {
  libraryId: number;
  title: string;
  author: string;
  isAvailable: boolean;
}

export interface ILibrariesService {
  createBook(data: Partial<Book>): Promise<Book>;
  deleteBook(id: ID): Promise<Book>
  createLibrary(data: Partial<Library>): Promise<Library>;
  deleteLibrary(id: ID): Promise<Library>;
  findBookById(id: ID): Promise<Book | null>;
  findAllBooks(params: SearchBookParams): Promise<Book[]>;
}
