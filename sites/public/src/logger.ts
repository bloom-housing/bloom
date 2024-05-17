import * as winston from "winston"
let log_level = "info"
if (process.env.LOG_LEVEL) {
  log_level = process.env.LOG_LEVEL
}
const logger = winston.createLogger({
  level: log_level,
  format: winston.format.json(),
  defaultMeta: { service: "doorway-public" },
  transports: [new winston.transports.Console()],
})
export { logger }
