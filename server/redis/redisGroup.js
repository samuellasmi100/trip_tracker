const { getInstance } = require('.')
const logger = require("../utils/Logger")
/**
 * Insert a group record with symbol to Redis.
 * @param {string} groupName Name of the redis records group.
 * @param {string} key Record key.
 * @param {string} value Record value as a string.
 * @param {object} options Record options as a object.
 * @return {Promise<string>} Inserted record key.
 */
const insertToGroup = async (groupName, key, value, options) => {
  try {
    const keyToInsert = _generateGroupKey(groupName, key)
    await (await getInstance()).set(keyToInsert, value, options)
    return key
  } catch (error) {
    console.log(`failed to insert group to redis, error: ${error}`)
  }
}

/**
 * Get a record from Redis group with key.
 * @param {string} groupName Name of the redis records group.
 * @param {string} key Record key.
 * @return {Promise<string>} Record value.
 */
const getFromGroup = async (groupName, key) => {
  try {
    const keyToInsert = _generateGroupKey(groupName, key)
    const value = await (await getInstance()).get(keyToInsert)
    return value
  } catch (error) {
    console.log(`failed to get from group to redis, error: ${error}`)

  }
}

/**
 * Delete record from a group inside Redis.
 * @param {string} groupName Name of the redis records group.
 * @param {string} key Record key.
 * @return {Promise<string>} Deleted record key.
 */
const deleteFromGroup = async (groupName, key) => {
  try {
    const keyToInsert = _generateGroupKey(groupName, key)
    await (await getInstance()).del(keyToInsert)
    return key
  } catch (error) {
    console.log(`failed to delete from group to redis, error: ${error}`)

  }
}

/**
 * Get and Delete record from a group inside Redis.
 * @param {string} groupName Name of the redis records group.
 * @param {string} key Record key.
 * @return {Promise<string>} Record value.
 */
const getDeleteFromGroup = async (groupName, key) => {
  try {
    const keyToInsert = _generateGroupKey(groupName, key)
    const value = await (await getInstance()).getDel(keyToInsert)
    return value
  } catch (error) {
    console.log(`failed to get and delete from group to redis, error: ${error}`)

  }
}

/**
 * Expire record by group and key.
 * @param {string} groupName Name of the redis records group.
 * @param {string} key Record key.
 * @param {number} seconds Record key.
 * @return {Promise<string>} Record key.
 */
const expireByKey = async (groupName, key, seconds) => {
  try {
    const keyToExpire = _generateGroupKey(groupName, key)
    await (await getInstance()).expire(keyToExpire, seconds)
    return key
  } catch (error) {
    console.log(`failed to get expire by key from group to redis, error: ${error}`)

  }
}

/**
 * Return AysncInterable that for each one of his promises should return a group record value.
 * @param {string} groupName Name of the redis records group.
 * @return {AsyncIterator} Group records as AsyncIterator.
 */
async function* getAllGroupKeyValues(groupName) {
  try {
    const keysFormatToInsert = _generateGroupKey(groupName, '*')
    const groupKeys = await (await getInstance()).keys(keysFormatToInsert)

    for (const groupKey of groupKeys) {
      const key = _removeGroupFromKey(groupKey)
      const value = await (await getInstance()).get(groupKey)
      yield { [key]: value }
    }
    return true
  } catch (error) {
    console.log(`failed to get all key from group to redis, error: ${error}`)
  }
}

/**
 * Return all group keys.
 * @param {string} groupName Name of the redis records group.
 * @return {Array<string>} Group keys.
 */
const getAllGroupKeys = async (groupName) => {
  try {
    const keysFormatToInsert = _generateGroupKey(groupName, '*')
    const groupKeys = await (await getInstance()).keys(keysFormatToInsert)
    return groupKeys
  } catch (error) {
    console.log(`failed to get all group keys to redis, error: ${error}`)
  }
}

module.exports = {
  insertToGroup,
  getFromGroup,
  deleteFromGroup,
  getDeleteFromGroup,
  getAllGroupKeys,
  getAllGroupKeyValues,
  expireByKey,
}

const _generateGroupKey = (groupName, key) => {
  try {
    return `${groupName}:${key}`
  } catch (error) {
    console.error(error)
  }
}

const _removeGroupFromKey = (groupNameKey) => {
  try {
    if (typeof groupNameKey !== 'string') {
      throw new Error(`groupNameKey '${groupNameKey}' must to be a String`)
    }

    const groupNameKeyParts = groupNameKey.split(':')

    if (!groupNameKeyParts[0] || !groupNameKeyParts[groupNameKeyParts.length - 1]) {
      throw new Error(`Cannot remove group tag from key '${groupNameKey}', please check for a valid format`)
    }
    if (groupNameKeyParts.filter((w) => w).length <= 1) {
      throw new Error(`Cannot remove group tag from key '${groupNameKey}', please check for a valid format`)
    }
    if (groupNameKeyParts.length <= 1) {
      throw new Error(`Cannot remove group tag from key '${groupNameKey}', please check for a valid format`)
    }
    return groupNameKeyParts.slice(1).join(':')
  } catch (error) {
    console.error(error)
  }
}
