import { createLogger, format, transports } from 'winston';

// custom log display format
format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${
    stack || message
  }`;
});
let log_level = 'info';
if (process.env.LOG_LEVEL) {
  log_level = process.env.LOG_LEVEL;
}
const options = {
  console: {
    level: log_level,
  },
};

const instanceLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [new transports.Console(options.console)],
};

export const instance = createLogger(instanceLogger);
