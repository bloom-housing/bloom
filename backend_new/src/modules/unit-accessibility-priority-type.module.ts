import { Module } from '@nestjs/common';
import { UnitAccessibilityPriorityTypeController } from '../controllers/unit-accessibility-priority-type.controller';
import { UnitAccessibilityPriorityTypeService } from '../services/unit-accessibility-priority-type.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [UnitAccessibilityPriorityTypeController],
  providers: [UnitAccessibilityPriorityTypeService],
  exports: [UnitAccessibilityPriorityTypeService],
})
export class UnitAccessibilityPriorityTypeServiceModule {}
