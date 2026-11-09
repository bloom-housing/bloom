import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContentTransferController } from '../controllers/content-transfer.controller';
import { ContentTransferService } from '../services/content-transfer.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule, HttpModule],
  controllers: [ContentTransferController],
  providers: [ContentTransferService],
  exports: [ContentTransferService],
})
export class ContentTransferModule {}
