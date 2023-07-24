import { Module } from '@nestjs/common';
import { MultiselectQuestionController } from '../controllers/multiselect-question.controller';
import { MultiselectQuestionService } from '../services/multiselect-question.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [MultiselectQuestionController],
  providers: [MultiselectQuestionService, PrismaService],
  exports: [MultiselectQuestionService, PrismaService],
})
export class MultiselectQuestionModule {}
