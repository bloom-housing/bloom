import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../services/email.service';
import { JurisdictionService } from '../services/jurisdiction.service';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { EmailProvider } from '../services/email-provider.service';
import { SendGridService } from '../services/sendgrid.service';
import { AwsSesService } from '../services/aws-ses.service';

const emailProvider = {
  provide: EmailProvider,
  useClass: process.env.USE_AWS_SES ? AwsSesService : SendGridService,
};

@Module({
  imports: [],
  controllers: [],
  providers: [
    EmailService,
    JurisdictionService,
    TranslationService,
    ConfigService,
    GoogleTranslateService,
    Logger,
    emailProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}
