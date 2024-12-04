const flightsDb = require("./flightsDb")

const addFlightsDetails = async (paymentsData,vacationId) => {
    return await flightsDb.addFlightsDetails(paymentsData,vacationId)
}
const updateFlightsDetails = async (paymentsData,vacationId) => {
    return await flightsDb.updateFlightsDetails(paymentsData,vacationId)
}
const getFlightsDetails = async (userId,familyId,isInGroup,vacationId) => {

    const result = await flightsDb.getFlightsDetails(userId,vacationId)
    if(result.length === 0){
        if(Number(isInGroup) === 1){
            const isSourceUserExist = await getFlightsByFamily(familyId,vacationId)
            if(isSourceUserExist.length > 0){
                let dataToUpdate = {
                    "outbound_flight_date":isSourceUserExist[0].outbound_flight_date,
                    "return_flight_date": isSourceUserExist[0].return_flight_date,
                    "outbound_flight_number":isSourceUserExist[0].outbound_flight_number,
                    "return_flight_number": isSourceUserExist[0].return_flight_number,
                    "outbound_airline": isSourceUserExist[0].outbound_airline,
                    "return_airline": isSourceUserExist[0].return_airline,
                    "user_id":userId
                } 
                await flightsDb.addFlightsDetails(dataToUpdate,vacationId)
            }
        }
    }else {
        const isSourceUserExist = await getFlightsByFamily(familyId,vacationId)
        if(Number(isInGroup) === 1){
            if(isSourceUserExist.length > 0){
                let dataToUpdate = {
                    "outbound_flight_date":isSourceUserExist[0].outbound_flight_date,
                    "return_flight_date": isSourceUserExist[0].return_flight_date,
                    "outbound_flight_number":isSourceUserExist[0].outbound_flight_number,
                    "return_flight_number": isSourceUserExist[0].return_flight_number,
                    "outbound_airline": isSourceUserExist[0].outbound_airline,
                    "return_airline": isSourceUserExist[0].return_airline,
                    "user_id":userId
                } 
                await flightsDb.updateFlightsDetails(dataToUpdate,vacationId)
            }
        }
    }
    return await flightsDb.getFlightsDetails(userId,vacationId)
}
const getFlightsByFamily = async (id,vacationId) => {
    return await flightsDb.getFlightsByFamily(id,vacationId)
}

module.exports = {
    addFlightsDetails,
    updateFlightsDetails,
    getFlightsDetails,
    getFlightsByFamily
    
}