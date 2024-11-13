const path = require('path')
const Transport = require('winston-transport')
const { createLogger, format, transports } = require('winston')

const { combine, timestamp, printf } = format

const ConsoleLoggerFormat = printf(({ level, message, timestamp: ts }) => `[${ts}] ${level}: ${message}`)
const { sendToLog } = require('../utils/rabbitmq/logQueue')

class RabbitMQTransport extends Transport {
  constructor(options) {
    super(options)
  }

  async log(level, message, meta, callback) {
    try {
      await sendToLog(level, message, meta.timestamp,false)
    } catch (error) {
      console.error(error)
    }
    callback()
  }
}

const logger = createLogger({
  format: combine(
    format((info) => {
      info.level = info.level.toUpperCase()
      return info
    })(),
    timestamp(),
    ConsoleLoggerFormat,
    format.colorize()
  ),
  transports: [
    new transports.Console({ format: ConsoleLoggerFormat }),
    // new transports.File({
    //   filename: process.env.LOGS_PATH ? path.join(process.env.LOGS_PATH, 'main.log') : path.join(__dirname, '../logs/main.log'),
    // }),
    // new transports.File({
    //   filename: process.env.LOGS_PATH ? path.join(process.env.LOGS_PATH, 'errors.log') : path.join(__dirname, '../logs/errors.log'),
    //   level: 'error',
    // }),
    // new transports.File({
    //   filename: process.env.LOGS_PATH ? path.join(process.env.LOGS_PATH, 'warnings.log') : path.join(__dirname, '../logs/warnings.log'),
    //   level: 'warn',
    // }),
    new RabbitMQTransport(),
  ],
})

module.exports = logger