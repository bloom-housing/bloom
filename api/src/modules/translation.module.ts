import { Logger, Module } from '@nestjs/common';
import { TranslationController } from '../controllers/translation.controller';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [TranslationController],
  providers: [TranslationService, GoogleTranslateService, Logger],
  exports: [TranslationService],
})
export class TranslationModule {}
