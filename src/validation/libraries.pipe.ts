import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { type ObjectSchema } from "joi";

@Injectable()
export class LibrariesValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(validatingValue: any) {
    for (let [key, value] of Object.entries(validatingValue)) {
      switch (key) {
        case "id":
          validatingValue[key] = Number(value);
          break;
        case "libraryId":
          validatingValue[key] = Number(value);
          break;
        case "library":
          validatingValue[key] = Number(value);
          break;
        case "year":
          validatingValue[key] = Number(value);
          break;
        case "availableOnly":
          validatingValue[key] = Boolean(value);
          break;
        case "totalCopies":
          validatingValue[key] = Number(value);
          break;
        case "availableCopies":
          validatingValue[key] = Number(value);
          break;
        case "offset":
          validatingValue[key] = Number(value);
          break;
        case "limit":
          validatingValue[key] = Number(value);
          break;
        default:
          validatingValue[key] = value;
          break;
      }
    }

    const { error } = this.schema.validate(validatingValue);
    if (error) {
      throw new BadRequestException(`Validation failed - ${error.message}`);
    }

    return validatingValue;
  }
}
