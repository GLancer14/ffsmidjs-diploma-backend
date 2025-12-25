import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: "postgresql://postgres:1234@localhost:5432/libraries-2?schema=public" });
    super({ adapter });
  }

  onModuleInit() {
    this.$connect;
  }

  onModuleDestroy() {
    this.$disconnect;
  }
}