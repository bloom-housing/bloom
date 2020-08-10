import { Injectable } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import Handlebars from "handlebars"
import path from "path"
import { User } from "../entity/user.entity"
import Polyglot from "node-polyglot"

@Injectable()
export class EmailService {
  polyglot: Polyglot

  constructor(private readonly sendGrid: SendGridService) {
    this.polyglot = new Polyglot({
      phrases: { register: { welcome: "Welcome" } },
    })

    // Handlebars.registerHelper("t", function (phrase: string, options?: any) {
    //   return this.polyglot.t(phrase, options)
    // })
  }

  public async welcome(user: User) {
    const template = Handlebars.compile(path.join(__dirname, "views/register-email.hbs"))
    const t = Handlebars.compile("asdsdads{{test}}")
    const resp = t({ test: "abd" })
    console.log(resp)
    // const response = await this.sendGrid.send({
    //   to: user.email,
    //   from: "test@example.com",
    //   subject: "Welcome to Bloom",
    //   text: "and easy to do anywhere, even with Node.js",
    //   // html: template({ user: user }),
    //   html: "Email body",
    // })

    await this.sendGrid.send(
      {
        to: user.email,
        // from: "test",
        subject: "Welcome to Bloom",
        text: "and easy to do anywhere, even with Node.js",
        // html: template({ user: user }),
        html: "Email body",
      },
      false,
      (error, info) => {
        console.error(error)
      }
    )
  }
}
