const flightsDb = require("./flightsDb")

const addFlightsDetails = async (paymentsData) => {
    return await flightsDb.addFlightsDetails(paymentsData)
}
const updateFlightsDetails = async (paymentsData) => {
    return await flightsDb.updateFlightsDetails(paymentsData)
}
const getFlightsDetails = async (userId,familyId,isInGroup) => {
    const result = await flightsDb.getFlightsDetails(userId)
    if(result.length === 0){
        if(isInGroup){
            const isSourceUserExist = await getFlightsByFamily(familyId)
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
                await flightsDb.addFlightsDetails(dataToUpdate)
            }
        }
    }
    return await flightsDb.getFlightsDetails(userId)
   

//   const result = await flightsDb.getFlightsDetails(userId)
//   console.log(result)
//   if(result.length > 0){

//   }
//   const isSourceUserExist = await getFlightsByFamily(result[0].family_id)
}
const getFlightsByFamily = async (id) => {
    return await flightsDb.getFlightsByFamily(id)
}

module.exports = {
    addFlightsDetails,
    updateFlightsDetails,
    getFlightsDetails,
    getFlightsByFamily
    
}