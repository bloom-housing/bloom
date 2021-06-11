import { Module } from "@nestjs/common"
import { SendGridModule } from "@anchan828/nest-sendgrid"
import { TranslationsModule } from "../../translations/translations.module"
import { EmailService } from "./email.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SharedModule } from "../shared.module"
import { CountyCodeResolverService } from "../services/county-code-resolver.service"

@Module({
  imports: [
    SharedModule,
    TranslationsModule,
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get<string>("EMAIL_API_KEY"),
      }),
    }),
  ],
  providers: [EmailService, CountyCodeResolverService],
  exports: [EmailService],
})
export class EmailModule {}
