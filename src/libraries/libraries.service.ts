import { Injectable } from '@nestjs/common';
import { ILibrariesService, SearchBookParams, SearchLibraryParams } from './types/libraries';
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
        title: data.title,
        author: data.author,
        year: data.year,
        description: data.description,
        coverImage: data.coverImage,
        library: {
          create: {
            totalCopies: data.totalCopies,
            availableCopies: data.availableCopies,
            isAvailable: true,
            library: {
              connect: {
                id: data.libraryId
              }
            }
          }
        }
      }
    });
  }

  async deleteBook(id: ID): Promise<Book> {
    await this.prisma.bookOnLibrary.deleteMany({
      where: { bookId: id },
    });

    return this.prisma.book.delete({
      where: { id },
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
      where: { id },
    });
  }

  findBookById(id: ID): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  findLibraryById(id: ID): Promise<Library | null> {
    return this.prisma.library.findUnique({
      where: { id },
    });
  }

  findAllLibraries(params: SearchLibraryParams): Promise<Library[]> {
    let orCondition;
    if (params) {
      orCondition = [
        { name: { contains: params.searchString } },
        { address: { contains: params.searchString } },
      ];
    }
    // const andCondition = [
    //   params.name ? { name: { contains: params.name } } : { name: undefined },
    //   params.address ? { contactPhone: { contains: params.address } } : { contactPhone: undefined },
    // ].filter(Boolean);

    return this.prisma.library.findMany({
      skip: params.offset || undefined,
      take: params.limit || undefined,
      // where: andCondition.length !== 0 ? { AND: andCondition } : undefined,
      where: orCondition.length !== 0 ? { OR: orCondition } : undefined,
    });
  }

  getLibrariesCount(): Promise<number> {
    return this.prisma.library.count();
  }

  findAllBooks(params: Partial<SearchBookParams>): Promise<Book[]> {
    if (!params.author && !params.title && !params.libraryId) {
      return Promise.resolve([]);
    }

    return this.prisma.book.findMany({
      where: {
        AND: [
          {
            OR: [
              params.author ? { author: params.author } : {},
              params.title ? { title: params.title } : {},
              params.libraryId ? { 
                library: {
                some: {
                  libraryId: params.libraryId,
                  isAvailable: params.isAvailable
                }
              } } : {}
            ].filter(cond => Object.keys(cond).length > 0),
          },
          { library: {
            some: {
              isAvailable: params.isAvailable,
            }
          } }
        ],
      },
      include: {
        library: {
          where: {
            isAvailable: params.isAvailable
          },
          include: {
            library: true
          }
        }
      }
      // where: {
      //   OR: [
      //     { library: {
            
      //     }params.libraryId || undefined },
      //     { author: params.author },
      //     { title: params.title },
      //   ],
      //   AND: [
      //     { isAvailable: params.isAvailable },
      //   ],
      // }
    });
  }
}
