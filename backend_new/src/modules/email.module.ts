import { SendGridModule } from '@anchan828/nest-sendgrid';
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EmailService } from '../services/email.service';
import { JurisdictionService } from '../services/jurisdiction.service';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';

@Module({
  imports: [
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get<string>('EMAIL_API_KEY'),
      }),
    }),
  ],
  controllers: [],
  providers: [
    EmailService,
    JurisdictionService,
    TranslationService,
    ConfigService,
    GoogleTranslateService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
