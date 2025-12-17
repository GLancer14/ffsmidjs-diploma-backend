import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { type ObjectSchema } from "joi";

@Injectable()
export class BookRentalValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(validatingValue: any) {
    for (let [key, value] of Object.entries(validatingValue)) {
      switch (key) {
        case "id":
          validatingValue[key] = Number(value);
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
