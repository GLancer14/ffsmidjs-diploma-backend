import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log("jwt guard runs")
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException("Wrong JWT token");
    }

    console.log(user)
    return user;
  }
}