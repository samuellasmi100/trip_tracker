const getAvailableDatesByRoom = (bookings, startDate, endDate) => {
  if (!bookings || bookings.length === 0) {
    // If there are no bookings, the entire range is available for all rooms
    return [];
  }

  // Hebrew weekdays array
  const hebrewWeekdays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  // Group bookings by room_id
  const bookingsByRoom = bookings.reduce((acc, booking) => {
    if (!acc[booking.room_id]) {
      acc[booking.room_id] = [];
    }
    acc[booking.room_id].push(booking);
    return acc;
  }, {});

  const availableDatesByRoom = {};

  // Helper function to generate an array of dates between two dates
  const generateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];

    while (start <= end) {
      // Format date as 'DD-MM DayOfWeek'
      const day = String(start.getDate()).padStart(2, '0'); // Get day (01-31)
      const month = String(start.getMonth() + 1).padStart(2, '0'); // Get month (01-12)
      const weekday = hebrewWeekdays[start.getDay()]; // Get the Hebrew name of the weekday (0-6)

      // Create the formatted date: 'DD-MM DayOfWeek'
      const formattedDate = `${day}-${month} ${weekday}`;
      dateRange.push(formattedDate);

      // Increment the date by 1
      start.setDate(start.getDate() + 1);
    }

    return dateRange;
  };

  // Process each room's bookings
  for (const roomId in bookingsByRoom) {
    const roomBookings = bookingsByRoom[roomId];

    // Sort bookings by start_date
    roomBookings.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    const availableDates = [];

    // Check for a gap before the first booking
    if (new Date(roomBookings[0].start_date) > new Date(startDate)) {
      availableDates.push(...generateDateRange(startDate, roomBookings[0].start_date));
    }

    // Find gaps between bookings
    let lastEndDate = new Date(roomBookings[0].end_date);

    for (let i = 1; i < roomBookings.length; i++) {
      const currentStartDate = new Date(roomBookings[i].start_date);

      if (lastEndDate < currentStartDate) {
        availableDates.push(...generateDateRange(lastEndDate.toISOString().split('T')[0], currentStartDate.toISOString().split('T')[0]));
      }

      lastEndDate = new Date(roomBookings[i].end_date);
    }

    // Check for a gap after the last booking
    if (lastEndDate < new Date(endDate)) {
      availableDates.push(...generateDateRange(lastEndDate.toISOString().split('T')[0], endDate));
    }

    // Store the available dates for this room
    availableDatesByRoom[roomId] = availableDates;
  }

  return availableDatesByRoom;
};

module.exports = { getAvailableDatesByRoom };
