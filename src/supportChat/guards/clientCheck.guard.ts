import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { SupportRequestService } from "../supportRequest.service";

@Injectable()
export class ClientIdCheckGuard implements CanActivate {
  constructor(
    private supportRequestService: SupportRequestService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user.role !== "client") {
      return true;
    }

    const authenticatedUser = req.user.id;
    const clientIdOfRequest = await this.supportRequestService.findSupportRequestById(req.params.id)

    if (authenticatedUser !== clientIdOfRequest?.user) {
      throw new ForbiddenException("Неверные данные пользователя");
    }

    return true;
  }
}