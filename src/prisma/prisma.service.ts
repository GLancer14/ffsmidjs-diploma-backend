import { Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, User } from "../generated/prisma/client";
import { RegisterUserDto } from "src/users/types/dto/users";
import bcrypt from "bcrypt";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:1234@localhost:5432/libraries-2?schema=public" });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log("Отсутствуют данные администратора");
      throw new InternalServerErrorException("Отсутствуют данные администратора");
    }

    this.upsertAdmin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: "администратор",
      contactPhone: "+79001234567",
      role: "admin",
    });
  }

  onModuleDestroy() {
    this.$disconnect();
  }

  async upsertAdmin(data: RegisterUserDto): Promise<User | undefined> {
    let retries = 5;
    let lastError: any;
    
    while(retries > 0) {
      try {
        const { password, ...userWithoutPass } = data;
        const passwordHash = await bcrypt.hash(data.password, 10);
        const userWithHashedPass = {
          ...userWithoutPass,
          passwordHash,
        };
      
        const user = await this.user.upsert({
          where: { email: data.email },
          update: {},
          create: { ...userWithHashedPass },
        });
      
        const requestCreationTime = new Date();
        await this.supportRequest.upsert({
          where: { user: user.id },
          update: {},
          create: {
            user: user.id,
            createdAt: requestCreationTime,
          },
        });
      
        return user;
      } catch(error) {
        lastError = error;
        console.log(`Failed to create admin user. Retries left: ${retries - 1}`);
        retries -= 1;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
}
