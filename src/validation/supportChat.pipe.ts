import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { type ObjectSchema } from "joi";
import { GetChatListParamsDto } from "src/supportChat/types/dto/supportChat";

@Injectable()
export class SupportChatValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    // value = {
    //   ...value,
    //   isActive: value.isActive ? !!value.isActive : undefined,
    //   offset: value.offset && +value.offset,
    //   limit: value.limit && +value.limit,
    // }

    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(`Validation failed - ${error.message}`);
    }

    return value;
  }
}
