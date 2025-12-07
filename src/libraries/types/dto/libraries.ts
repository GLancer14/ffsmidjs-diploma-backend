import { ID } from "src/types/commonTypes";

export interface BookDto {
  libraryId: number;
  title: string;
  author: string;
  year: number;
  description: string;
  coverImage?: Express.Multer.File;
  totalCopies: number;
}

export interface LibraryDto {
  name: string;
  address: string;
  description: string;
}

// export interface SearchBookParams {
//   libraryId: number;
//   title: string;
//   author: string;
//   isAvailable: boolean;
// }

// export interface ILibrariesService {
//   createBook(data: Partial<Book>): Promise<Book>;
//   deleteBook(id: ID): Promise<Book>
//   createLibrary(data: Partial<Library>): Promise<Library>;
//   deleteLibrary(id: ID): Promise<Library>;
//   findBookById(id: ID): Promise<Book>;
//   findAllBooks(params: SearchBookParams): Promise<Book[]>;
// }
