import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { EmailService } from '../services/email.service';
import { JurisdictionService } from '../services/jurisdiction.service';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { SendGridService } from '../services/sendgrid.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    EmailService,
    JurisdictionService,
    TranslationService,
    ConfigService,
    GoogleTranslateService,
    SendGridService,
    MailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
