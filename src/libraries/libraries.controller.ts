import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipe, ParseFilePipeBuilder, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
// import { Book } from './types/libraries';
import { type ID } from 'src/types/commonTypes';
import { type BookDto, type LibraryDto } from './types/dto/libraries';
import { FileInterceptor } from '@nestjs/platform-express';
import { Book } from 'src/generated/prisma/client';

@Controller("api")
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get("common/books")
  getBooks(
    @Query("library") library: number,
    @Query("author") author: string,
    @Query("title") title: string,
    @Query("availableOnly") availableOnly: boolean,
  ): Promise<Book[]> {
    return this.librariesService.findAllBooks({
      libraryId: library,
      author,
      title,
      isAvailable: availableOnly,
    });
  }

  @Get("common/books/:id")
  getBook(@Param("id") id: ID) {
    return this.librariesService.findBookById(id);
  }

  @Post("admin/libraries/")
  createLibrary(@Body() library: LibraryDto) {
    return this.librariesService.createLibrary(library);
  }

  @Post("admin/books/")
  @UseInterceptors(FileInterceptor("coverImage", {
    dest: "../uploads/images",
  }))
  createBook(
    @Body() bookData: BookDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
       .addFileTypeValidator({
        fileType: "jpeg",
       })
       .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
       })
    ) file: Express.Multer.File
  ) {
    return this.librariesService.createBook({
      ...bookData,
      coverImage: file.filename
    });
  }

  @Delete("admin/books/:id")
  deleteBook(id: ID) {
    return this.librariesService.deleteBook(id);
  }

  @Delete("common/libraries/:id")
  deleteLibrary(id: ID) {
    return this.librariesService.deleteLibrary(id);
  }
}
