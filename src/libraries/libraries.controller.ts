import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { type ID } from 'src/types/commonTypes';
import type { FindBookDto, BookDto, LibraryDto, UpdateLibraryDto, UpdateBookDto } from './types/dto/libraries';
import { FileInterceptor } from '@nestjs/platform-express';
import { Book } from 'src/generated/prisma/client';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import multerOptions from 'src/config/multerOptions';
import { LibrariesValidationPipe } from 'src/validation/libraries.pipe';
import {
  createBookValidationSchema,
  createLibraryValidationSchema,
  findLibrariesValidationSchema,
  getBooksValidationSchema,
  updateBookValidationSchema,
  updateLibraryValidationSchema,
} from 'src/validation/schemas/libraries.joiSchema';
import { idValidationSchema } from 'src/validation/schemas/common.joiSchema';
import { type SearchLibraryParams } from './types/libraries';

@Controller("api")
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get("common/books")
  getBooks(
    @Query(new LibrariesValidationPipe(getBooksValidationSchema)) query: FindBookDto
  ): Promise<Book[]> {
    return this.librariesService.findAllBooks({
      libraryId: query.library,
      author: query.author,
      title: query.title,
      isAvailable: query.availableOnly,
    });
  }

  @Get("common/books/:id")
  getBook(
    @Param(new LibrariesValidationPipe(idValidationSchema)) params: { id: ID }
  ) {
    return this.librariesService.findBookById(params.id);
  }

  @Get("common/libraries/:id")
  getLibrary(
    @Param(new LibrariesValidationPipe(idValidationSchema)) params: { id: ID }
  ) {
    return this.librariesService.findLibraryById(params.id);
  }

  @Get("common/libraries/")
  getLibraries(
    @Query(new LibrariesValidationPipe(findLibrariesValidationSchema)) query: SearchLibraryParams
  ) {
    return this.librariesService.findAllLibraries({
      limit: query.limit,
      offset: query.offset,
      searchString: query.searchString,
      // name: query.name,
      // address: query.address,
    });
  }

  @Get("common/libraries-count/")
  getLibrariesCount() {
    return this.librariesService.getLibrariesCount();
  }

  @UsePipes(new LibrariesValidationPipe(createLibraryValidationSchema))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("admin/libraries/")
  @Roles("admin")
  createLibrary(@Body() library: LibraryDto) {
    return this.librariesService.createLibrary(library);
  }

  @UsePipes(new LibrariesValidationPipe(updateLibraryValidationSchema))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put("admin/libraries/")
  @Roles("admin")
  updateLibrary(@Body() library: UpdateLibraryDto) {
    return this.librariesService.updateLibrary(library);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("admin/books/")
  @Roles("admin", "manager")
  @UseInterceptors(FileInterceptor("coverImage", multerOptions))
  createBook(
    @Body(new LibrariesValidationPipe(createBookValidationSchema)) bookData: BookDto,
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
  @Put("admin/books/")
  @Roles("admin", "manager")
  @UseInterceptors(FileInterceptor("coverImage", multerOptions))
  updateBook(
    @Body(new LibrariesValidationPipe(updateBookValidationSchema)) bookData: UpdateBookDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File
  ) {
    return this.librariesService.updateBook({
      ...bookData,
      coverImage: file?.filename,
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete("admin/books/:id")
  @Roles("admin", "manager")
  deleteBook(
    @Param(new LibrariesValidationPipe(idValidationSchema)) params: { id: ID }
  ) {
    return this.librariesService.deleteBook(params.id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete("admin/libraries/:id")
  @Roles("admin")
  deleteLibrary(
    @Param(new LibrariesValidationPipe(idValidationSchema)) params: { id: ID }
  ) {
    return this.librariesService.deleteLibrary(params.id);
  }
}
