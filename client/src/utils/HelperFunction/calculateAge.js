const calculateAgeByFlightDate = (birth_date,return_flight_date) => {
    if(return_flight_date !== undefined){
        let birthDate = new Date(birth_date);
        let returnDate = new Date(return_flight_date);
        
        let age = returnDate.getFullYear() - birthDate.getFullYear();
        
        if (
            returnDate.getMonth() < birthDate.getMonth() || 
            (returnDate.getMonth() === birthDate.getMonth() && returnDate.getDate() < birthDate.getDate())
        ) {
            return age--;
        }else {
          return age
        }
    }else {
        const today = new Date(); 
        const birth = new Date(birth_date); 
        let age = today.getFullYear() - birth.getFullYear(); 
    
   
        const isBeforeBirthday = 
            today.getMonth() < birth.getMonth() || 
            (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
        
        if (isBeforeBirthday) {
            age--;
        }
    
        return age;
    }
   
    
  } 
  
  export default calculateAgeByFlightDate;