import { Module } from '@nestjs/common';
import { ReservedCommunityTypeController } from '../controllers/reserved-community-type.controller';
import { ReservedCommunityTypeService } from '../services/reserved-community-type.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReservedCommunityTypeController],
  providers: [ReservedCommunityTypeService],
  exports: [ReservedCommunityTypeService],
})
export class ReservedCommunityTypeModule {}
