import { Module } from '@nestjs/common';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from './libraries.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [LibrariesController],
  providers: [LibrariesService, PrismaService],
})
export class LibrariesModule {}
