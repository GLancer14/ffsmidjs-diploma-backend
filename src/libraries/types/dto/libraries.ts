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
