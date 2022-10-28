import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MultiselectQuestionsController } from "./multiselect-question.controller"
import { MultiselectQuestionsService } from "./multiselect-question.service"
import { MultiselectQuestion } from "../multiselect-question/entities/multiselect-question.entity"
import { Unit } from "../units/entities/unit.entity"
import { AuthModule } from "../auth/auth.module"
import { Listing } from "../listings/entities/listing.entity"
import { ActivityLogModule } from "../activity-log/activity-log.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([MultiselectQuestion, Unit, Listing]),
    AuthModule,
    ActivityLogModule,
  ],
  providers: [MultiselectQuestionsService],
  exports: [MultiselectQuestionsService],
  controllers: [MultiselectQuestionsController],
})
export class MultiselectQuestionsModule {}
