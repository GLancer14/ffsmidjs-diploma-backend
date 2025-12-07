import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
// import { Book } from './types/libraries';
import { type ID } from 'src/types/commonTypes';
import { type BookDto, type LibraryDto } from './types/dto/libraries';
import { FileInterceptor } from '@nestjs/platform-express';
import { Book } from 'src/generated/prisma/client';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import multerOptions from 'src/config/multerOptions';

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


  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("admin/libraries/")
  @Roles("admin")
  createLibrary(@Body() library: LibraryDto) {
    return this.librariesService.createLibrary(library);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("admin/books/")
  @Roles("admin")
  @UseInterceptors(FileInterceptor("coverImage", multerOptions))
  createBook(
    @Body() bookData: BookDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File
  ) {
    return this.librariesService.createBook({
      ...bookData,
      coverImage: file?.filename,
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete("admin/books/:id")
  @Roles("admin")
  deleteBook(@Param("id") id: ID) {
    return this.librariesService.deleteBook(id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete("admin/libraries/:id")
  @Roles("admin")
  deleteLibrary(@Param("id") id: ID) {
    return this.librariesService.deleteLibrary(id);
  }
}
