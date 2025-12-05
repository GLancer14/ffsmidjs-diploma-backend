import { Injectable } from '@nestjs/common';
import { ILibrariesService, SearchBookParams } from './types/libraries';
import { ID } from 'src/types/commonTypes';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from 'src/generated/prisma/client';

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
  constructor(private prisma: PrismaService) {}

  createBook(data) {
    return this.prisma.book.create({
      data: {
        libraryId: data.libraryId,
        title: data.title,
        author: data.author,
        year: data.year,
        description: data.description,
        coverImage: data.coverImage,
        isAvailable: data.isAvailable,
      }
    });
  }

  deleteBook(id: ID) {
    return this.prisma.book.delete({
      where: { id },
    });
  }

  createLibrary(data) {
    return this.prisma.library.create({
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  deleteLibrary(id: ID) {
    return this.prisma.library.delete({
      where: { id },
    });
  }

  findBookById(id: ID) {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  findAllBooks(params: Partial<SearchBookParams>) {
    return this.prisma.book.findMany({
      where: {
        OR: [
          {
            id: params.libraryId,
          },
          {
            author: params.author
          },
          {
            title: params.title,
          },
          {
            isAvailable: params.isAvailable,
          },
        ]
      }
    });
  }
}
