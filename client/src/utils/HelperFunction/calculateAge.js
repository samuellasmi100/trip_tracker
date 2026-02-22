// Parse birth_date string — supports DD/MM/YYYY and YYYY-MM-DD
function parseBirthDate(birth_date) {
    if (!birth_date) return null;
    if (birth_date.includes('/')) {
        const parts = birth_date.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(Number(year), Number(month) - 1, Number(day));
        }
    }
    return new Date(birth_date);
}

const calculateAgeByFlightDate = (birth_date,return_flight_date) => {
    const birth = parseBirthDate(birth_date);
    if (!birth || isNaN(birth.getTime())) return "";

    if(return_flight_date !== undefined){
        let returnDate = new Date(return_flight_date);

        let age = returnDate.getFullYear() - birth.getFullYear();

        if (
            returnDate.getMonth() < birth.getMonth() ||
            (returnDate.getMonth() === birth.getMonth() && returnDate.getDate() < birth.getDate())
        ) {
            return age--;
        }else {
          return age
        }
    }else {
        const today = new Date();
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