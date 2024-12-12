const flightsService = require("../flights/flightsService")
const roomsService = require("../rooms/roomsService")
const notesService = require("../notes/notesService")
const paymentsService = require("../payments/paymentsService")
const familyDb = require("./familyDb")


const addFamily = async (data,vacationId) => {
    return await familyDb.addFamily(data,vacationId)
}

const getFamilies = async (vacationId) => {
    return await familyDb.getFamilies(vacationId)
}

const getUserDetails = async (id,familyId) => {
    const [userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails] = await Promise.all([
        getParentFamilyMember(id),
        flightsService.getFlightsDetails(id),
        roomsService.getChosenRoom(id),
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