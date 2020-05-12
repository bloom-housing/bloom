import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from "@tsed/common"
import "@tsed/swagger"
import "@tsed/ajv"
import * as Path from "path"
import dotenv from "dotenv"
import cors from "cors"
import methodOverride from "method-override"
import compress from "compression"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import "@tsed/typeorm"

const rootDir = Path.resolve(__dirname)

dotenv.config({ path: ".env" })

const config = {
  port: parseInt(process.env.PORT || "3001", 10),
}

@ServerSettings({
  rootDir,
  typeorm: [
    {
      name: "default",
      type: "postgres",
      database: "bloom",
      entities: [`${__dirname}/entity/*{.ts,.js}`],
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      subscribers: [`${__dirname}/subscriber/*{.ts,.js}`],
      cli: {
        migrationsDir: `services/listings/src/migrations`,
      },
    },
  ],
  acceptMimes: ["application/json"],
  port: config.port,
  mount: {
    "/": "${rootDir}/controllers/**/*.ts",
  },
  swagger: [
    {
      path: "/api-docs",
    },
  ],
})
export class Server extends ServerLoader {
  /**
   * This method lets you configure the middleware required for your application to work.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      )

    return null
  }
}
