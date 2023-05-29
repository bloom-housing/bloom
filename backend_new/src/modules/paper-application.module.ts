import { Module } from '@nestjs/common';
import { PaperApplicationController } from '../controllers/paper-application.controller';
import { PaperApplicationService } from '../services/paper-application.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [PaperApplicationController],
  providers: [PaperApplicationService, PrismaService],
  exports: [PaperApplicationService, PrismaService],
})
export class PaperApplicationModule {}
