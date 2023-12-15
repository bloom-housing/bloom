import { Module } from '@nestjs/common';
import { ApplicationController } from '../controllers/application.controller';
import { ApplicationService } from '../services/application.service';
import { PrismaModule } from './prisma.module';
import { EmailModule } from './email.module';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { ApplicationCsvExporterService } from '../services/application-csv-export.service';
import { UnitTypeService } from '../services/unit-type.service';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    ListingModule,
    MultiselectQuestionModule,
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    ApplicationCsvExporterService,
    UnitTypeService,
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
