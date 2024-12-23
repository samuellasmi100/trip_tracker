const getCategory = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.expenses_category;`
}

const getSubCategory = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.expenses_sub_category where expenses_category_id = ?;`
}

module.exports = {
    getCategory,
    getSubCategory
}