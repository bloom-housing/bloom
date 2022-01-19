import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ActivityLog } from "./entities/activity-log.entity"
import { ActivityLogService } from "./services/activity-log.service"

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), forwardRef(() => AuthModule)],
  controllers: [],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
