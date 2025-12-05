import { Injectable } from '@nestjs/common';
import { Book, ILibrariesService, SearchBookParams } from './types/libraries';
import { ID } from 'src/types/commonTypes';

const initialBook = {
  libraryId: 0,
  title: "string",
  author: "string",
  year: 0,
  description: "string",
  coverImage: null,
  isAvailable: false,
  totalCopies: 0,
  availableCopies: 0,
}

const initialLibrary = {
  name: "string",
  address: "string",
  description: "string",
  createdAt: new Date,
  updatedAt: new Date,
};

@Injectable()
export class LibrariesService implements ILibrariesService {
  createBook(data: Partial<Book>) {
    return Promise.resolve(initialBook);
  }

  deleteBook(id: ID) {
    return Promise.resolve(initialBook);
  }

  createLibrary(data: Partial<Book>) {
    return Promise.resolve(initialLibrary);
  }

  deleteLibrary(id: ID) {
    return Promise.resolve(initialLibrary);
  }

  findBookById(id: ID) {
    return Promise.resolve(initialBook);
  }

  findAllBooks(params: Partial<SearchBookParams>) {
    return Promise.resolve([initialBook]);
  }
}
