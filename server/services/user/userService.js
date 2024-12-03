const flightsService = require("../flights/flightsService")
const userRoomsService = require("../userRooms/userRoomsService")
const notesService = require("../notes/notesService")
const paymentsService = require("../payments/paymentsService")
const userDb = require("./userDb")


const addGuest = async (data) => {
    return await userDb.addGuest(data)
}

const getFamilyGuests = async (id) => {
    return await userDb.getFamilyGuests(id)
}
const updateGuest = async (data) => {
    return await userDb.updateGuest(data)
}

const getFamilyMamber = async (id) => {
    return await userDb.getFamilyMamber(id)
}
const saveRegistrationForm = async (filename,fileType,filePath,id) => {
    return await userDb.saveRegistrationForm(filename,fileType,filePath,id)
}
const getParentFamilyMamber = async (id) => {
    return await userDb.getParentFamilyMamber(id)
}
const getUserDetails = async (id,familyId,isIngroup) => {
    const [userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails] = await Promise.all([
        getParentFamilyMamber(id),
        flightsService.getFlightsDetails(id,familyId,isIngroup),
        userRoomsService.getChossenRoom(id),
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