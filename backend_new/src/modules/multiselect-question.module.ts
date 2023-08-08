import { Module } from '@nestjs/common';
import { MultiselectQuestionController } from '../controllers/multiselect-question.controller';
import { MultiselectQuestionService } from '../services/multiselect-question.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MultiselectQuestionController],
  providers: [MultiselectQuestionService],
  exports: [MultiselectQuestionService],
})
export class MultiselectQuestionModule {}
