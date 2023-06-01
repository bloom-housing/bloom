import { Module } from '@nestjs/common';
import { ApplicationController } from '../controllers/application.controller';
import { ApplicationService } from '../services/application.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService],
  exports: [ApplicationService, PrismaService],
})
export class ApplicationModule {}
