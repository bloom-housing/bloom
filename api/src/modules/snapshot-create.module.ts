import { Module } from '@nestjs/common';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { SnapshotCreateController } from '../controllers/snapshot-create.controller';
import { SnapshotCreateService } from '../services/snapshot-create.service';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [SnapshotCreateController],
  providers: [SnapshotCreateService],
  exports: [SnapshotCreateService],
})
export class SnapshotCreateModule {}
