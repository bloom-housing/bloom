import { Module } from '@nestjs/common';
import { SmsService } from '../services/sms.service';

@Module({
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
