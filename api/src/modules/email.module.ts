import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsSesService } from '../services/aws-ses.service';
import { EmailProvider } from '../services/email-provider.service';
import { EmailService } from '../services/email.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { GovDeliveryService } from '../services/gov-delivery.service';
import { JurisdictionService } from '../services/jurisdiction.service';
import { SendGridService } from '../services/sendgrid.service';
import { TranslationService } from '../services/translation.service';

const emailProvider = {
  provide: EmailProvider,
  useClass: process.env.USE_AWS_SES ? AwsSesService : SendGridService,
};

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    EmailService,
    JurisdictionService,
    TranslationService,
    ConfigService,
    GoogleTranslateService,
    GovDeliveryService,
    Logger,
    emailProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}
