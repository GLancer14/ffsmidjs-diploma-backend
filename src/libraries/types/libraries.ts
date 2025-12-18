import { Book, Library } from "src/generated/prisma/client";
import { ID } from "src/types/commonTypes";

export interface SearchBookParams {
  libraryId: number;
  title: string;
  author: string;
  isAvailable: boolean;
}

export interface SearchLibraryParams {
  limit: number;
  offset: number;
  name: string;
  address: string;
}

export interface ILibrariesService {
  createBook(data: Partial<Book>): Promise<Book>;
  deleteBook(id: ID): Promise<Book>
  createLibrary(data: Partial<Library>): Promise<Library>;
  deleteLibrary(id: ID): Promise<Library>;
  findBookById(id: ID): Promise<Book | null>;
  findAllBooks(params: SearchBookParams): Promise<Book[]>;
}
