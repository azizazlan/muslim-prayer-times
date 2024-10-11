
const VITE_ADHAN_MINS = Math.max(0, parseInt(import.meta.env.VITE_ADHAN_MINS || '10', 10));

import { parse, isAfter, subMinutes, setHours, setMinutes } from 'date-fns';

const isPrayerTimePast = (now: Date, prayerTime: string | Date, prayerName: string) => {
  let prayerDate: Date;

  if (typeof prayerTime === 'string') {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    prayerDate = setMinutes(setHours(new Date(now), hours), minutes);
  } else if (prayerTime instanceof Date) {
    prayerDate = new Date(prayerTime);
  } else {
    console.error(`Invalid prayer time for ${prayerName}: ${prayerTime}`);
    return false; // Return false if prayerTime is neither string nor Date
  }
  // The prayer time has passed more than VITE_ADHAN_MINS minutes ago
  const afterMinutesAgo = subMinutes(now, VITE_ADHAN_MINS);
  return isAfter(afterMinutesAgo, prayerDate);
};

export { isPrayerTimePast };

const isCurrentPrayer = (prayerName: string, currentPrayer: string) => prayerName === currentPrayer;
export { isCurrentPrayer };
