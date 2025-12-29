import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ILibrariesService, SearchBookParams, SearchLibraryParams } from './types/libraries';
import { ID } from 'src/types/commonTypes';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookDto, ExistingBookDto, LibraryDto, UpdateBookDto, UpdateLibraryDto } from './types/dto/libraries';
import { Book, Library } from 'src/generated/prisma/client';
import path from 'node:path';
import * as fs from "fs/promises";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

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

  updateBook(data: UpdateBookDto & { coverImage?: string }): Promise<Book> {
    return this.prisma.book.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title || undefined,
        author: data.author || undefined,
        year: data.year || undefined,
        description: data.description || undefined,
        coverImage: data.coverImage || undefined,
        library: {
          update: {
            where: {
              bookId_libraryId: {
                bookId: data.id,
                libraryId: data.libraryId,
              },
            },
            data: {
              totalCopies: data.totalCopies || undefined,
              availableCopies: data.availableCopies || undefined,
              isAvailable: true,
              library: {
                connect: {
                  id: data.libraryId
                }
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

    await this.prisma.bookRental.deleteMany({
      where: {
        bookId: id
      }
    });

    const deletedBook = await this.prisma.book.delete({
      where: { id },
    });

    if (deletedBook.coverImage) {
      const filePath = path.join(__dirname, "../../../uploads/images", deletedBook.coverImage);
      await fs.rm(filePath);
    }

    return deletedBook;
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

  updateLibrary(data: UpdateLibraryDto): Promise<Library> {
    return this.prisma.library.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name || undefined,
        address: data.address || undefined,
        description: data.description || undefined,
      }
    });
  }

  async deleteLibrary(id: ID): Promise<Library> {
    await this.prisma.bookRental.deleteMany({
      where: {
        libraryId: id
      }
    });

    const deletedLibrary = await this.prisma.library.delete({
      where: { id },
    });

    if (deletedLibrary) {
      await this.prisma.bookRental.deleteMany({
        where: {
          libraryId: deletedLibrary.id,
        },
      });
    }

    return deletedLibrary;
  }

  findBookById(id: ID): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  findBookByTitle(title: string, libraryId: number): Promise<Book[] | undefined> {
    try {
      return this.prisma.book.findMany({
        take: 20,
        where: {
          title: { contains: title, mode: "insensitive" },
        },
      });
    } catch(e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new BadRequestException("Данная книга уже есть в этой библиотеке");
      }

      throw new InternalServerErrorException("Ошибка сервера");
    }
  }

  findLibraryById(id: ID): Promise<Library | null> {
    return this.prisma.library.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            totalCopies: true,
            availableCopies: true,
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                year: true,
                description: true,
                coverImage: true,
              },
            },
          },
        },
      },
    }).then(library => {
      if (library) {
        const libraryWithCopiesCount = {
          ...library,
          totalCopies: library.book.reduce((acc, item) => acc + item.totalCopies, 0),
          availableCopies: library.book.reduce((acc, item) => acc + item.availableCopies, 0)
        };
        // const {book, ...libraryWithoutBook} = libraryWithCopiesCount;
        return libraryWithCopiesCount;
      } else {
        return null;
      }
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
      include: {
        book: {
          select: {
            totalCopies: true,
            availableCopies: true
          }
        },
      }
    }).then(libraries => {
      return libraries.map(library => {
        const libraryWithCopiesCount = {
          ...library,
          totalCopies: library.book.reduce((acc, item) => acc + item.totalCopies, 0),
          availableCopies: library.book.reduce((acc, item) => acc + item.availableCopies, 0)
        };
        const {book, ...libraryWithoutBook} = libraryWithCopiesCount;
        return libraryWithoutBook;
      })
    });
  }

  getLibrariesCount(): Promise<number> {
    return this.prisma.library.count();
  }

  async getBooksCountForWelcome(): Promise<{all: number | null, activeRents: number}> {
    const all = (await this.prisma.bookOnLibrary.aggregate({
      _sum: {
        totalCopies: true
      }
    }))._sum.totalCopies;

    const activeRents = await this.prisma.bookRental.count({
      where: {
        status: "active"
      }
    });

    return { all, activeRents };
  }

  async findAllBooks(params: Partial<SearchBookParams>): Promise<Book[]> {
    if (!params.author && !params.title && !params.libraryId) {
      return Promise.resolve([]);
    }

    const availableCopiesNow = await this.prisma.book.findMany({
      where: {
        AND: [
          {
            OR: [
              params.author ? { author: { contains: params.author } } : {},
              params.title ? { title: { contains: params.title } } : {},
              params.libraryId ? { 
                library: {
                  some: {
                    libraryId: params.libraryId,
                    isAvailable: params.isAvailable
                  }
                }
              } : {}
            ].filter(cond => Object.keys(cond).length > 0),
          },
          {
            library: {
              some: {
                isAvailable: params.isAvailable,
              }
            }
          }
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
    });

    const rentedForCopiesNow = await Promise.all(availableCopiesNow.map(async (book) => {
      const bookOnLibraryDataAccordingToReservedCopies = await Promise.all(book.library.map(async (bookOnLibraryData) => {
        const amountOfReservedBooks = await this.prisma.bookRental.count({
          where: {
            bookId: bookOnLibraryData.bookId,
            libraryId: bookOnLibraryData.libraryId,
            dateStart: {
              lte: params.dateEnd || undefined,
            },
            dateEnd: {
              gte: params.dateStart || undefined,
            }
          },
        });

        return {
          ...bookOnLibraryData,
          availableCopies: bookOnLibraryData.availableCopies - amountOfReservedBooks,
        };
      }));

      return {
        ...book,
        library: bookOnLibraryDataAccordingToReservedCopies,
      };
    }));

    return rentedForCopiesNow;
  }

  addExistingBookToLibrary(bookData: ExistingBookDto) {
    return this.prisma.bookOnLibrary.create({
      data: {
        bookId: bookData.bookId,
        libraryId: bookData.libraryId,
        availableCopies: bookData.availableCopies,
        totalCopies: bookData.totalCopies,
      }
    })
  }
}

