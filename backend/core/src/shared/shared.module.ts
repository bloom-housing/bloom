import { Module } from "@nestjs/common"
import { SendGridModule } from "@anchan828/nest-sendgrid"
import { EmailService } from "./email.service"

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.EMAIL_API_KEY,
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class SharedModule {}
