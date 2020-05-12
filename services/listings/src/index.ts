import { Server } from "./Server"
import { Configuration, registerProvider } from "@tsed/di"
import { createConnection } from "@tsed/typeorm"
import { Connection, ConnectionOptions } from "typeorm"
import { $log, ServerLoader } from "@tsed/common"

export const CONNECTION = Symbol.for("CONNECTION")
export type CONNECTION = Connection

const CONNECTION_NAME = "default"

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const settings = configuration.get<ConnectionOptions[]>("typeorm")!
    const connectionOptions = settings.find((o) => o.name === CONNECTION_NAME)

    return createConnection(connectionOptions)
  },
})

async function bootstrap() {
  try {
    $log.debug("Start server...")
    const server = await ServerLoader.bootstrap(Server)

    await server.listen()
    $log.debug("Server initialized")
  } catch (er) {
    $log.error(er)
  }
}

bootstrap()
