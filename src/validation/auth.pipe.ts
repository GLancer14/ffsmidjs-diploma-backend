import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { type ObjectSchema } from "joi";

@Injectable()
export class AuthValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(`Validation failed - ${error.message}`);
    }

    return value;
  }
}
