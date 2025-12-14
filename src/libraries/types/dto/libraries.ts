import { ID } from "src/types/commonTypes";

export interface FindBookDto {
  library: number;
  title: string;
  author: string;
  availableOnly: boolean;
}

export interface BookDto {
  libraryId: ID;
  title: string;
  author: string;
  year?: number;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
}

export interface LibraryDto {
  name: string;
  address: string;
  description?: string;
}
