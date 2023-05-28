import { Module } from '@nestjs/common';
import { ReservedCommunityTypeController } from '../controllers/reserved-community-type.controller';
import { ReservedCommunityTypeService } from '../services/reserved-community-type.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [ReservedCommunityTypeController],
  providers: [ReservedCommunityTypeService, PrismaService],
  exports: [ReservedCommunityTypeService, PrismaService],
})
export class ReservedCommunityTypeModule {}
