const redis = require("redis");
let logger = require("../utils/Logger");
let _client;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const _createConnection = async () => {
  try {
    _client = redis.createClient({
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
    });

    _client.on("ready", () => console.info("Redis is ready to use"));
    _client.on("error", (err) => console.error("Redis client error", err));
    _client.on("reconnecting", () => console.info("Redis try to reconnect"));

    await _client.connect();
  } catch (error) {
    console.log(`failed to connect to redis, error: ${error}`);
  }
};

/**
 * Return redis client connected to the db.+
 * @return {Promise<redis.RedisClientType>} client instance in a promise.
 */
const getInstance = async () => {
  try {
    if (!_client || !_client.isOpen) {
      await _createConnection();
    }
    return _client;
  } catch (error) {
    console.log(`failed to get instance from redis, error: ${error}`);
  }
};

module.exports = {
  getInstance,
};
