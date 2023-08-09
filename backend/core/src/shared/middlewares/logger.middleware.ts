// middleware/request-logging.ts
import { Logger } from "@nestjs/common"
import morgan, { format } from "morgan"

export function useRequestLogging(app) {
  const logger = new Logger("Request")
  app.use(
    morgan(":method :url [:status] content-length :res[content-length] - :response-time ms", {
      stream: {
        write: (message) => logger.log(message.replace("\n", "")),
      },
    })
  )
}
