import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user.id);
  }

  async deserializeUser(payload: any, done: Function) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload }
      });
      if (!user) {
        return done(null, null);
      }

      done(null, user);
    } catch(e) {
      console.error("Deserealization error: ", e)
      done(e, null)
    }
    
  }
}