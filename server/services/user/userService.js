const flightsService = require("../flights/flightsService")
const userRoomsService = require("../userRooms/userRoomsService")
const notesService = require("../notes/notesService")
const paymentsService = require("../payments/paymentsService")
const userDb = require("./userDb")


const addGuest = async (data,vacationId) => {
    return await userDb.addGuest(data,vacationId)
}

const getFamilyGuests = async (id,vacationId) => {
    return await userDb.getFamilyGuests(id,vacationId)
}
const updateGuest = async (data,vacationId) => {
    return await userDb.updateGuest(data,vacationId)
}
const getFamilyMamber = async (id,vacationId) => {
    return await userDb.getFamilyMamber(id,vacationId)
}
const saveRegistrationForm = async (filename,fileType,filePath,id) => {
    return await userDb.saveRegistrationForm(filename,fileType,filePath,id)
}
const getUserDetails = async (id,familyId,isIngroup) => {
    const [userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails] = await Promise.all([
        getParentFamilyMamber(id),
        flightsService.getFlightsDetails(id,familyId,isIngroup),
        userRoomsService.getChosenRoom(id),
        notesService.getParentNote(id),
        paymentsService.getHistoryPayments(familyId)
      ])
let dataToReturn = {
    userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails
}

    return dataToReturn
}



module.exports = {
    addGuest,
    getFamilyGuests,
    updateGuest,
    getFamilyMamber,
    saveRegistrationForm,
    getUserDetails
}