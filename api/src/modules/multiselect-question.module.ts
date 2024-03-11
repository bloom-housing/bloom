import { Module } from '@nestjs/common';
import { MultiselectQuestionController } from '../controllers/multiselect-question.controller';
import { MultiselectQuestionService } from '../services/multiselect-question.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [MultiselectQuestionController],
  providers: [MultiselectQuestionService],
  exports: [MultiselectQuestionService],
})
export class MultiselectQuestionModule {}
