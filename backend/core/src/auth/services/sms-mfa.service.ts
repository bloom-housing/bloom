import { Injectable } from "@nestjs/common"

@Injectable()
export class SmsMfaService {
  public async sendMfaCode(phoneNumber: string, mfaCode: string) {
    console.log("Sending mfa code through sms")
  }
}
