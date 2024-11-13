const notificationQueue = require('./notificationQueue')
const authQueue = require('./authQueue')
const userQueue = require('./userQueue')
const regionQueue = require('./regionQueue')
const bondQueue = require('./bondQueue')
const auctionQueue = require('./auctionQueue')
const reportsQueue = require('./reportsQueue')
const auctionTransactionQueue = require('./auctionTransactionQueue')
 const userLogQueue = require("./userLogQueue")

const init_queues = async () => {
    try {
      await notificationQueue.initQueue()
      await authQueue.initQueue()
      await userQueue.initQueue()
      await regionQueue.initQueue()
      await bondQueue.initQueue()
      await auctionQueue.initQueue()
      await auctionTransactionQueue.initQueue()
      await reportsQueue.initQueue()
      await userLogQueue.initQueue()
    } catch (error) {
        console.log(error)
      console.error(`failed to init rabbit queues, error: ${error}`)
    }
  }
  
  module.exports = {
    init_queues,
  }
  