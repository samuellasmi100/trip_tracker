const flightsService = require("../flights/flightsService")
const roomsService = require("../rooms/roomsService")
const notesService = require("../notes/notesService")
const paymentsService = require("../payments/paymentsService")
const familyDb = require("./familyDb")


const addFamily = async (data) => {
    return await familyDb.addFamily(data)
}

const getFamilies = async () => {
    return await familyDb.getFamilies()
}

const getUserDetails = async (id,familyId) => {
    const [userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails] = await Promise.all([
        getParentFamilyMamber(id),
        flightsService.getFlightsDetails(id),
        roomsService.getChossenRoom(id),
        notesService.getParentNote(id),
        paymentsService.getHistoryPayments(familyId)
      ])
let dataToReturn = {
    userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails
}
    return dataToReturn
}

module.exports = {
    addFamily,
    getFamilies,
    getUserDetails,
}