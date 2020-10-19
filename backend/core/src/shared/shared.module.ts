import { Module } from "@nestjs/common"
import { SendGridModule } from "@anchan828/nest-sendgrid"
import { EmailService } from "./email.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import Joi from "@hapi/joi"

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_API_KEY: Joi.string().required(),
        EMAIL_FROM_ADDRESS: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid("development", "staging", "production", "test")
          .default("development"),
      }),
    }),
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
export class SharedModule {}
