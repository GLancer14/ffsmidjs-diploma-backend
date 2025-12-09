import { Injectable } from '@nestjs/common';
import { ILibrariesService, SearchBookParams } from './types/libraries';
import { ID } from 'src/types/commonTypes';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookDto, LibraryDto } from './types/dto/libraries';
import { Book, Library } from 'src/generated/prisma/client';

@Injectable()
export class LibrariesService implements ILibrariesService {
  constructor(private prisma: PrismaService) {}

  createBook(data: BookDto & { coverImage?: string }): Promise<Book> {
    return this.prisma.book.create({
      data: {
        libraryId: Number(data.libraryId),
        title: data.title,
        author: data.author,
        year: Number(data.year),
        description: data.description,
        coverImage: data.coverImage,
      }
    });
  }

  deleteBook(id: ID): Promise<Book> {
    return this.prisma.book.delete({
      where: { id: +id },
    });
  }

  createLibrary(data: LibraryDto): Promise<Library> {
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

  deleteLibrary(id: ID): Promise<Library> {
    return this.prisma.library.delete({
      where: { id: +id },
    });
  }

  findBookById(id: ID): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id: +id },
    });
  }

  findAllBooks(params: Partial<SearchBookParams>): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        libraryId: Number(params.libraryId) || undefined,
        author: params.author,
        title: params.title,
        isAvailable: params.isAvailable,
      }
    });
  }
}
