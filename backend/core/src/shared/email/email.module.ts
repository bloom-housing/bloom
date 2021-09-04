import { forwardRef, Module } from "@nestjs/common"
import { SendGridModule } from "@anchan828/nest-sendgrid"
import { TranslationsModule } from "../../translations/translations.module"
import { EmailService } from "./email.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SharedModule } from "../shared.module"
import { JurisdictionsModule } from "../../jurisdictions/jurisdictions.module"

@Module({
  imports: [
    SharedModule,
    forwardRef(() => JurisdictionsModule),
    TranslationsModule,
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get<string>("EMAIL_API_KEY"),
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
