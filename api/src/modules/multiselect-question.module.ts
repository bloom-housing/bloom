import { Logger, Module } from '@nestjs/common';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { MultiselectQuestionController } from '../controllers/multiselect-question.controller';
import { MultiselectQuestionService } from '../services/multiselect-question.service';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [MultiselectQuestionController],
  providers: [Logger, MultiselectQuestionService],
  exports: [MultiselectQuestionService],
})
export class MultiselectQuestionModule {}
