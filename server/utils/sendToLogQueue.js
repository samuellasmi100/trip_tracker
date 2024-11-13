const uuid = require('uuid').v4
const moment = require('moment')

const RabbitConnectionManager = require('../message_stream/RabbitMQConnectionManager')
const RABBIT_MQ_INSTANCE_NAME = process.env.RABBIT_MQ_INSTANCE_NAME;
const BOND_LOG = process.env.BOND_LOG

const sendToLog = async (level, response, timestamp,saveInDb) => {
  try {
    const responseMessage = {
      id: uuid(),
      level,
      service: 'bond-server',
      data: response,
      saveInDb,
      timestamp: timestamp ? timestamp : moment().format('YYYY-MM-DD HH:mm:ss.sss'),
    }
      await RabbitConnectionManager.pushMessageToQueue(RABBIT_MQ_INSTANCE_NAME,BOND_LOG, JSON.stringify(responseMessage))
  } catch (error) {
    const errorMessage = `Failed to send message to Log queue, level: ${level}, data: ${JSON.stringify(response)}`
    console.error(errorMessage)
  }
}

module.exports = {
  sendToLog,
}
