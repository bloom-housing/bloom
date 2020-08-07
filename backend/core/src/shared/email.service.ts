import { Injectable } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import Handlebars from "handlebars"
import path from "path"
import { User } from "../entity/user.entity"

@Injectable()
export class EmailService {
  constructor(private readonly sendGrid: SendGridService) {}

  public async welcome(user: User) {
    const template = Handlebars.compile(path.join(__dirname, "views/register-email.hbs"))
    await this.sendGrid.send({
      to: user.email,
      from: "test@example.com",
      subject: "Welcome to Bloom",
      html: template({ user: user }),
    })
  }
}
