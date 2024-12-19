const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf, prettyPrint, colorize } = format;
const path = require("path");
const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
  format: combine(timestamp(), loggerFormat, prettyPrint(), colorize()),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    }),
    new transports.File({
        filename: path.join(__dirname, "../logs/info.log"),
    }),
  ],
});

// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}
module.exports = logger;
