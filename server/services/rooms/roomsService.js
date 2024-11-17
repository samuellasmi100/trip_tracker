const roomsDb = require("./roomsDb")

const getAll = async () => {
    return roomsDb.getAll()
}

module.exports = {
    getAll
}