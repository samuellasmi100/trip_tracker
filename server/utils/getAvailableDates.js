

  const getAvailableDates = (bookings,startDate,endDate) => {
    bookings.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    const gaps = [];
    
    if (new Date(bookings[0].start_date) > new Date(startDate)) {
      gaps.push({ gap_start: startDate, gap_end: bookings[0].start_date });
    }
  
    for (let i = 0; i < bookings.length - 1; i++) {
      const currentBookingEnd = new Date(bookings[i].end_date);
      const nextBookingStart = new Date(bookings[i + 1].start_date);
    
      if (currentBookingEnd < nextBookingStart) {
        gaps.push({ gap_start: bookings[i].end_date, gap_end: bookings[i + 1].start_date });
      }
    }
    const lastBookingEnd = new Date(bookings[bookings.length - 1].end_date);
    if (lastBookingEnd < new Date(endDate)) {
      gaps.push({ gap_start: bookings[bookings.length - 1].end_date, gap_end: endDate });
    }

    const validGaps = gaps.filter(gap => new Date(gap.gap_end) > new Date(gap.gap_start));
    return validGaps
  }

  module.exports = {getAvailableDates}
  

  