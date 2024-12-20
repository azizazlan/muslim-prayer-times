enum PrayerMode {
  ACTIVE = 'ACTIVE', // Current prayer timing is within the current time and the next prayer timing
  IMMEDIATE_NEXT = 'IMMEDIATE_NEXT', // It is the immediate next of the ACTIVE or current prayer 
  NEXT = 'NEXT', // Next prayer timing
  PREVIOUS = 'PREVIOUS', // Previous prayer timing
  INACTIVE = 'INACTIVE', // For example Syuruk, Last third of the night and etc. Ignore when calculating adhan lead time
}

enum PrayerName {
  SUBUH = 'Subuh',
  SYURUK = 'Syuruk',
  ZOHOR = 'Zohor',
  ASAR = 'Asar',
  MAGHRIB = 'Maghrib',
  ISYAK = 'Isyak'
}

type Prayer = {
  name: PrayerName;
  time: string;
  mode: PrayerMode;
}

export { Prayer, PrayerName, PrayerMode };