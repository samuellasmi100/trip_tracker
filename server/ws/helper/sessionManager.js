const sessions = []
const redisGroup = require("../../redis/redisGroup")
const REDIS_GROUP_SESSION_API = process.env.REDIS_GROUP_SESSION_API
const RabbitMQConnectionManager = require("../../message_stream/RabbitMQConnectionManager")
const notificationQueue = require("../../utils/rabbitmq/notificationQueue")

const get_sessions = () => sessions

const get_session = (id) => {
  return sessions[id]
}

const add_session = async (id, data) => {
  sessions[id] = data
  if (data.ws_id) {
    // await redisGroup.insertToGroup(REDIS_GROUP_SESSION_API, id, JSON.stringify(data))
  }
}

const update_session = async (ws_id, data) => {
  
}

const remove_from_session = async (ws_id) => {
  
}

const delete_session = async (id) => {
  delete sessions[id]
  // redisGroup.deleteFromGroup(REDIS_GROUP_SESSION_API, id)
}

module.exports = {
  get_sessions,
  get_session,
  add_session,
  update_session,
  remove_from_session,
  delete_session,
}
