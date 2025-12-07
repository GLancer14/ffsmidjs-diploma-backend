import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log("serializing user: ", user)
    done(null, user.id);
  }

  async deserializeUser(payload: any, done: Function) {
    console.log("deserializing user: ", payload);
    try {
      const user = this.prisma.user.findUnique({
        where: { id: payload }
      });
      console.log(user)

      if (!user) {
        console.log("not found: ", payload)
        return done(null, null);
      }

      done(null, user);
    } catch(e) {
      console.error("Deserealization error: ", e)
      done(e, null)
    }
    
  }
}