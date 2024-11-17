

const getAll =() => {
    return `SELECT rooms_id as roomId,type as roomType,size as roomSize,direction as roomDirection,floor as roomFloor FROM rooms;`
}

module.exports ={
    getAll
  }
  
  