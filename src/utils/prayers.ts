import { createEffect } from 'solid-js';
import { differenceInMinutes, differenceInSeconds, format, addDays, addSeconds, setHours, setMinutes, isAfter, isBefore, startOfDay, parse, set, subMinutes, subSeconds } from 'date-fns';
import { getByDay } from 'prayertiming';
import { Prayer } from '../types/prayer';
import { PrayerMode } from '../types/prayer';

const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;

interface GetPrayersProps {
  currentTime: Date;
  timingConfig: {};
}

function getPrayers(props: GetPrayersProps) {
  const { currentTime, timingConfig } = props;
  const prayerTimes = getByDay({
    currentTime,
    long: LONGITUDE,
    lat: LATITUDE,
    method: 'JAKIM',
    timeFormat: '24h',
    config: timingConfig
  });

  return [
    { name: "Subuh", time: prayerTimes.fajr },
    { name: 'Syuruk', time: prayerTimes.sunrise },
    { name: 'Zohor', time: prayerTimes.dhuhr },
    { name: 'Asar', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isyak', time: prayerTimes.isha }
  ]
}
export { getPrayers };

interface GetPrayerTimeProps {
  name: string;
  timingConfig: {};
}

function getPrayerTime(props: GetPrayerTimeProps) {
  const prayers = getPrayers({ timingConfig: props.timingConfig });
  const prayer = prayers.find(prayer => prayer.name === props.name);
  return prayer.time;
}
export { getPrayerTime };

interface ModeSelectorProps {
  prayer: Prayer;
  currentTime: Date;
  timingConfig: {};
}

function modeSelector(props: ModeSelectorProps) {
  const { prayer, timingConfig } = props;
  const currentTime = props.currentTime;

  if (prayer.name === 'Subuh') {
    const subuhTime = parse(getPrayerTime({ name: 'Subuh' }), 'HH:mm', currentTime);
    const syurukTime = parse(getPrayerTime({ name: 'Syuruk' }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isBefore(currentTime, subuhTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, subuhTime) && isBefore(currentTime, syurukTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  if (prayer.name === 'Zohor') {
    const syurukTime = parse(getPrayerTime({ name: 'Syuruk' }), 'HH:mm', currentTime); // Use date-fns parse method
    const zohorTime = parse(getPrayerTime({ name: 'Zohor' }), 'HH:mm', currentTime);
    const asarTime = parse(getPrayerTime({ name: 'Asar' }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isAfter(currentTime, syurukTime) && isBefore(currentTime, zohorTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, zohorTime) && isBefore(currentTime, asarTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  if (prayer.name === 'Asar') {
    const maghribTime = parse(getPrayerTime({ name: 'Maghrib' }), 'HH:mm', currentTime); // Use date-fns parse method
    const zohorTime = parse(getPrayerTime({ name: 'Zohor' }), 'HH:mm', currentTime);
    const asarTime = parse(getPrayerTime({ name: 'Asar' }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isAfter(currentTime, zohorTime) && isBefore(currentTime, asarTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, asarTime) && isBefore(currentTime, maghribTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }


  if (prayer.name === 'Maghrib') {
    const maghribTime = parse(getPrayerTime({ name: 'Maghrib' }), 'HH:mm', currentTime); // Use date-fns parse method
    const isyakTime = parse(getPrayerTime({ name: 'Isyak' }), 'HH:mm', currentTime);
    const asarTime = parse(getPrayerTime({ name: 'Asar' }), 'HH:mm', currentTime); // Use date-fns parse method

    if (isAfter(currentTime, asarTime) && isBefore(currentTime, maghribTime)) {
      return PrayerMode.IMMEDIATE_NEXT;
    }
    else if (isAfter(currentTime, maghribTime) && isBefore(currentTime, isyakTime)) {
      return PrayerMode.ACTIVE
    }
    else return PrayerMode.INACTIVE;
  }

  if (prayer.name === 'Isyak') {
    const isyakTime = parse(getPrayerTime({ name: 'Isyak' }), 'HH:mm', currentTime);
    const maghribTime = parse(getPrayerTime({ name: 'Maghrib' }), 'HH:mm', currentTime); // Use date-fns parse method-fns parse method

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

interface GetLeadPrayerProps {
  currentTime: Date;
  timingConfig: {};
}

function getLeadPrayer(props: GetLeadPrayerProps) {
  const { currentTime, timingConfig } = props;
  const prayers = getPrayers({ currentTime, timingConfig })
  const leadPrayer = prayers.find(prayer => modeSelector({ prayer, currentTime, timingConfig }) === PrayerMode.IMMEDIATE_NEXT && prayer.name !== 'Syuruk');
  return leadPrayer;
}
export { getLeadPrayer };

interface SecsUntilNextPrayerProps {
  currentTime: Date;
  timingConfig: {};
}

function secsUntilNextPrayer(props: SecsUntilNextPrayerProps) {
  const { currentTime, timingConfig } = props;
  const leadPrayer = getLeadPrayer({ currentTime, timingConfig });
  //get the difference
  if (leadPrayer) {
    const leadPrayerTime = parse(leadPrayer.time, 'HH:mm', currentTime)
    const secs = differenceInSeconds(leadPrayerTime, currentTime);
    return secs;
  }
  return 0;
}
export { secsUntilNextPrayer }