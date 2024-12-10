const staticDb = require("./staticDb")

const getMainGuests = async (vacationId) => {
    return await staticDb.getMainGuests(vacationId)
}

const getAllGuests = async (vacationId) => {
    return await staticDb.getAllGuests(vacationId)
}


module.exports = {
    getMainGuests,
    getAllGuests
    
}