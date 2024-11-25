const userDb = require("./userDb")
const flightsService = require("../flights/flightsService")
const roomsService = require("../rooms/roomsService")
const notesService = require("../notes/notesService")
const paymentsService = require("../payments/paymentsService")

const addGuest = async (data) => {
    return await userDb.addGuest(data)
}
const addFamily = async (data) => {
    return await userDb.addFamily(data)
}
const addChild = async (data) => {
    return await userDb.addChild(data)
}
const getFamilyMambers = async (id) => {
    return await userDb.getFamilyMambers(id)
}
const updateGuest = async (data) => {
    return await userDb.updateGuest(data)
}
const updateChild = async (data) => {
    return await userDb.updateChild(data)
}
const getFamilies = async () => {
    return await userDb.getFamilies()
}
const getAllFamilyMambers = async (id) => {
    return await userDb.getAllFamilyMambers(id)
}
const getChildDetails = async (id) => {
    const [userDetails, flightsDetails, roomsDetails, notesDetails] = await Promise.all([
         getFamilyMamber(id),
         flightsService.getChildDetails(id),
         roomsService.getChossenRoom(id, "child"),
         notesService.getChildNote(id),
      ])
let dataToReturn = {
    userDetails, flightsDetails, roomsDetails, notesDetails
}
    return dataToReturn
}
const getparentDetails = async (id,familyId) => {
    const [userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails] = await Promise.all([
        getParentFamilyMamber(id),
        flightsService.getParentDetails(id),
        roomsService.getChossenRoom(id, "parent"),
        notesService.getParentNote(id),
        paymentsService.getHistoryPayments(familyId)
      ])
let dataToReturn = {
    userDetails, flightsDetails, roomsDetails, notesDetails,paymentsDetails
}
    return dataToReturn
}

const getFamilyMamber = async (id) => {
    return await userDb.getFamilyMamber(id)
}
const getParentFamilyMamber = async (id) => {
    return await userDb.getParentFamilyMamber(id)
}
const saveRegistrationForm = async (filename,fileType,filePath,id) => {
    return await userDb.saveRegistrationForm(filename,fileType,filePath,id)
}

module.exports = {
    addGuest,
    addChild,
    getFamilyMambers,
    updateGuest,
    updateChild,
    addFamily,
    getFamilies,
    getAllFamilyMambers,
    getChildDetails,
    getFamilyMamber,
    getparentDetails,
    saveRegistrationForm
}