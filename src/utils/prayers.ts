import { differenceInMinutes, differenceInSeconds, format, addDays, addSeconds, setHours, setMinutes, isAfter, isBefore, startOfDay, parse, set, subMinutes, subSeconds } from 'date-fns';
import { Prayer } from '../types/prayer';
import { PrayerMode } from '../types/prayer';

interface GetPrayerTimeProps {
  prayers: [];
  name: string;
}

function getPrayerTime(props: GetPrayerTimeProps) {
  const { prayers } = props;
  const prayer = prayers.find(prayer => prayer.name === props.name);
  return prayer.time;
}
export { getPrayerTime };

interface ModeSelectorProps {
  prayers: [];
  prayer: Prayer;
  currentTime: Date;
}

function modeSelector(props: ModeSelectorProps) {
  const { prayers, prayer, currentTime } = props;

  if (prayer.name === 'Subuh') {
    const subuhTime = parse(getPrayerTime({ name: 'Subuh', prayers }), 'HH:mm', currentTime);
    const syurukTime = parse(getPrayerTime({ name: 'Syuruk', prayers }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isBefore(currentTime, subuhTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, subuhTime) && isBefore(currentTime, syurukTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  if (prayer.name === 'Zohor') {
    const syurukTime = parse(getPrayerTime({ name: 'Syuruk', prayers }), 'HH:mm', currentTime); // Use date-fns parse method
    const zohorTime = parse(getPrayerTime({ name: 'Zohor', prayers }), 'HH:mm', currentTime);
    const asarTime = parse(getPrayerTime({ name: 'Asar', prayers }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isAfter(currentTime, syurukTime) && isBefore(currentTime, zohorTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, zohorTime) && isBefore(currentTime, asarTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  if (prayer.name === 'Asar') {
    const zohorTime = parse(getPrayerTime({ name: 'Zohor', prayers }), 'HH:mm', currentTime);
    const asarTime = parse(getPrayerTime({ name: 'Asar', prayers }), 'HH:mm', currentTime); // Use date-fns parse method
    const maghribTime = parse(getPrayerTime({ name: 'Maghrib', prayers }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isAfter(currentTime, zohorTime) && isBefore(currentTime, asarTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, asarTime) && isBefore(currentTime, maghribTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }


  if (prayer.name === 'Maghrib') {
    const asarTime = parse(getPrayerTime({ name: 'Asar', prayers }), 'HH:mm', currentTime); // Use date-fns parse method
    const maghribTime = parse(getPrayerTime({ name: 'Maghrib', prayers }), 'HH:mm', currentTime); // Use date-fns parse method
    const isyakTime = parse(getPrayerTime({ name: 'Isyak', prayers }), 'HH:mm', currentTime);

    if (isAfter(currentTime, asarTime) && isBefore(currentTime, maghribTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, maghribTime) && isBefore(currentTime, isyakTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  if (prayer.name === 'Isyak') {
    const maghribTime = parse(getPrayerTime({ name: 'Maghrib', prayers }), 'HH:mm', currentTime); // Use date-fns parse method-fns parse method
    const isyakTime = parse(getPrayerTime({ name: 'Isyak', prayers }), 'HH:mm', currentTime);

    if (isAfter(currentTime, maghribTime) && isBefore(currentTime, isyakTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, isyakTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  return PrayerMode.INACTIVE;
}

export { modeSelector };