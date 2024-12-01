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
const getParentFamilyMamber = async (id) => {
    return await userDb.getParentFamilyMamber(id)
}
const saveRegistrationForm = async (filename,fileType,filePath,id) => {
    return await userDb.saveRegistrationForm(filename,fileType,filePath,id)
}

module.exports = {
    addGuest,
    getFamilyGuests,
    updateGuest,
    getFamilyMamber,
    saveRegistrationForm
}