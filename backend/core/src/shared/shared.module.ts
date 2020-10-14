import { Module } from "@nestjs/common"
import { SendGridModule } from "@anchan828/nest-sendgrid"
import { EmailService } from "./email.service"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    SendGridModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get<string>("EMAIL_API_KEY"),
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class SharedModule {}
