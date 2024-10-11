const getPrayerName = (language: string, prayerName: string) => {
  if (language === 'ms') {
    switch (prayerName) {
      case 'Fajr':
        return 'Subuh';
      case 'Sunrise':
        return 'Syuruk';
      case 'Dhuhr':
        return 'Zohor';
      case 'Asr':
        return 'Asar';
      case 'Maghrib':
        return 'Maghrib';
      case 'Isha':
        return 'Isyak';
      case 'Las3rd':
        return 'Sepertiga';
      default:
        return prayerName;
    }
  } else {
    switch (prayerName) {
      case 'Sunrise':
        return 'Sun';
      default:
        return prayerName;
    }
  };
}

export { getPrayerName };

