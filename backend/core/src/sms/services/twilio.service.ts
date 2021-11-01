import { Injectable } from "@nestjs/common"
import {
  MessageInstance,
  MessageListInstanceCreateOptions,
} from "twilio/lib/rest/api/v2010/account/message"
import TwilioClient = require("twilio/lib/rest/Twilio")
import twilio = require("twilio")

@Injectable()
export class TwilioService {
  client: TwilioClient

  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  async send(message: string, recipientPhoneNumber: string): Promise<MessageInstance> {
    const messageOptions: MessageListInstanceCreateOptions = {
      body: message,
      from: process.env.TWILIO_FROM_NUMBER,
      to: recipientPhoneNumber,
    }
    console.log("sending :" + JSON.stringify(messageOptions))
    return this.client.messages.create(messageOptions)
  }
}
