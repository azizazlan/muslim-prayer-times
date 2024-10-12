import { createEffect, createSignal, createResource, createMemo, onMount, onCleanup } from 'solid-js';
import { differenceInMinutes, differenceInSeconds, format, addDays, addSeconds, setHours, setMinutes, isAfter, isBefore, startOfDay, parse, set, subMinutes, subSeconds } from 'date-fns';
import type { Component } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";
// Utils
import { getPrayerName } from './utils/prayername';
import getWindowDimensions from './utils/getWindowDimensions';

// Components
import Adhan from './components/Adhan';
import Iqamah from './components/Iqamah';
import BottomStrip from './components/BottomStrip';
import DefaultMainArea from './components/DefaultMainArea';
import DevMode from './components/DevMode';
import TuneTimings from './components/UsrSettings/TuneTimings';
import PrayerTimes from './components/PrayerTimes';
import { DisplayMode } from "./types/displaymode";
import { Prayer } from "./types/prayer";
import { PrayerMode } from "./types/prayermode";
import logo from './logo.svg';
import styles from './App.module.scss';

const LANGUAGE = import.meta.env.VITE_LANGUAGE;
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const API_URL = `https://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '30', 10);
const ADHAN_LEAD_MINS_TEST = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS_TEST || '1', 10);

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const module = await import(`./i18n/${locale}.ts`);
    if (module && module.dict) {
      const dict: RawDictionary = module.dict;
      return i18n.flatten(dict);
    } else {
      console.error(`Dictionary for locale ${locale} is undefined or missing 'dict' export`);
      return {}; // Return an empty object as fallback
    }
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    return {}; // Return an empty object as fallback
  }
}

const App: Component = () => {

  const [locale, setLocale] = createSignal<Locale>(LANGUAGE);
  const [dict] = createResource(locale, fetchDictionary);
  dict(); // => Dictionary | undefined
  const t = i18n.translator(dict);
  const [isDemo, setIsDemo] = createSignal(false);
  const [location] = createSignal(LOCATION);
  const [currentTime, setCurrentTime] = createSignal(new Date());
  const memoizedCurrentTime = createMemo(() => currentTime());
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>(DisplayMode.DEFAULT);
  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [leadPrayer, setLeadPrayer] = createSignal<Prayer | null>(null);
  const memoizedLeadPrayer = createMemo(() => leadPrayer());
  const [lastApiTimestamp, setLastApiTimestamp] = createSignal<number>(0);
  const memoizedLastApiTimestamp = createMemo(() => lastApiTimestamp());
  const [lastFetchDate, setLastFetchDate] = createSignal<Date>(new Date());
  const [secondsLeft, setSecondsLeft] = createSignal<number>(0);
  const [isTestMode, setIsTestMode] = createSignal(false);
  const memoizedIsTestMode = createMemo(() => isTestMode());
  const [testStartTime, setTestStartTime] = createSignal<Date | null>(null);

  const toggleDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(mode);
  };

  const toggleTestScreenIqamah = () => {
    setDisplayMode(DisplayMode.IQAMAH);
  };

  const toggleRefetch = () => {
    fetchPrayers();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.log(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleTestSubuh = () => {
    const newTestMode = !isTestMode();
    setIsTestMode(newTestMode);

    if (newTestMode) {
      const subuhPrayer = prayers().find(prayer => prayer.name === 'Fajr' || prayer.name === 'Subuh');
      if (subuhPrayer) {
        const now = new Date();
        const [hours, minutes] = subuhPrayer.time.split(':').map(Number);

        let subuhTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });

        if (subuhTime < now) {
          subuhTime = set(subuhTime, { date: subuhTime.getDate() + 1 });
        }
        let nMinuteBeforeSubuh = subMinutes(subuhTime, ADHAN_LEAD_MINS_TEST);
        nMinuteBeforeSubuh = addSeconds(nMinuteBeforeSubuh, 55); // Make it quicker I can't wait one minute!
        setTestStartTime(nMinuteBeforeSubuh);
        setCurrentTime(nMinuteBeforeSubuh);
        setPrayers(prev => updatedPrayers());
        // console.log('Test mode activated. Current time set to:', oneMinuteBeforeSubuh.toLocaleString());
      } else {
        console.error('Subuh prayer not found');
        setIsTestMode(false);
      }
    } else {
      setCurrentTime(new Date());
      setTestStartTime(null);
      console.log('Test mode deactivated. Returned to current time.');
    }
  };

  const toggleTestSyuruk = () => {
    const newTestMode = !isTestMode();
    setIsTestMode(newTestMode);
    if (newTestMode) {
      const syurukPrayer = prayers().find(prayer => prayer.name === 'Syuruk');
      if (syurukPrayer) {
        const now = new Date();
        const [hours, minutes] = syurukPrayer.time.split(':').map(Number);
        let syurukTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
        if (syurukTime < now) {
          syurukTime = set(syurukTime, { date: syurukTime.getDate() + 1 });
        }
        let nMinuteBeforeTiming = subMinutes(syurukTime, ADHAN_LEAD_MINS_TEST);
        nMinuteBeforeTiming = addSeconds(nMinuteBeforeTiming, 55); // Make it quicker I can't wait one minute!
        setTestStartTime(nMinuteBeforeTiming);
        setCurrentTime(nMinuteBeforeTiming);
        setPrayers(prev => updatedPrayers());
      } else {
        console.error('Syuruk prayer not found');
        setIsTestMode(false);
      }
    } else {
      setCurrentTime(new Date());
      setTestStartTime(null);
      console.log('Test mode deactivated. Returned to current time.');
    }
  };

  const fetchPrayers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const timings = data.data.timings;
      setPrayers([
        { name: getPrayerName(LANGUAGE, 'Fajr'), time: timings.Fajr, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Sunrise'), time: timings.Sunrise, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Dhuhr'), time: timings.Dhuhr, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Asr'), time: timings.Asr, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Maghrib'), time: timings.Maghrib, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Isha'), time: timings.Isha, mode: PrayerMode.INACTIVE },
      ]);
      setLastFetchDate(new Date());
      const timestamp = parseInt(data.data.date.timestamp, 10);
      setLastApiTimestamp(timestamp);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const checkAndFetchPrayers = () => {
    const now = new Date();
    if (isAfter(now, startOfDay(addDays(lastFetchDate(), 1)))) {
      fetchPrayers();
    }
  };

  const checkPrayerProgress = () => {
    const leadPrayer = prayers().find(prayer => prayer.mode === PrayerMode.IMMEDIATE_NEXT && prayer.name !== 'Syuruk');
    if (leadPrayer) {
      setLeadPrayer(leadPrayer);
      const leadPrayerTime = parse(leadPrayer.time, 'HH:mm', currentTime());
      const secLeft = differenceInSeconds(leadPrayerTime, currentTime());
      setSecondsLeft(secLeft);

      const leadMins = isTestMode() ? ADHAN_LEAD_MINS_TEST : ADHAN_LEAD_MINS;
      if (displayMode() !== DisplayMode.IQAMAH && displayMode() !== DisplayMode.ADHAN && leadMins === differenceInMinutes(leadPrayerTime, currentTime()) + 1) {
        setDisplayMode(DisplayMode.ADHAN);
      }
      if (displayMode() === DisplayMode.ADHAN && secondsLeft() === 0) {
        setDisplayMode(DisplayMode.IQAMAH);
      }
      if (secLeft <= 0 && displayMode() !== DisplayMode.IQAMAH) {
        setDisplayMode(DisplayMode.IQAMAH);
      }
    }
  };

  const updatedPrayers = createMemo(() => {
    const now = currentTime();
    let activeIndex = -1;

    // Find the active prayer
    for (let i = 0; i < prayers().length; i++) {
      const prayer = prayers()[i];
      const nextPrayer = prayers()[(i + 1) % prayers().length];

      const prayerTime = parse(prayer.time, 'HH:mm', now);
      const nextPrayerTime = parse(nextPrayer.time, 'HH:mm',
        i === prayers().length - 1 ? addDays(now, 1) : now
      );

      if (isAfter(now, prayerTime) && isBefore(now, nextPrayerTime)) {
        activeIndex = i;
        break;
      }
    }

    return prayers().map((prayer, index) => {
      let mode;
      if (index === activeIndex) {
        mode = PrayerMode.ACTIVE;
      } else if (index === (activeIndex + 1) % prayers().length && prayer.name !== 'Syuruk') {
        setLeadPrayer(prayer);
        mode = PrayerMode.IMMEDIATE_NEXT;
      } else if (index > activeIndex || (activeIndex === -1 && index < prayers().length - 1)) {
        mode = PrayerMode.NEXT;
      } else {
        mode = PrayerMode.INACTIVE;
      }
      return { ...prayer, mode };
    });
  });

  createEffect(() => {
    fetchPrayers();
    const dailyCheckInterval = setInterval(checkAndFetchPrayers, 60000); // Check every minute
  });

  createEffect(() => {
    memoizedLeadPrayer()
    memoizedCurrentTime();
    memoizedLastApiTimestamp();
    memoizedIsTestMode();
  });

  onMount(() => {
    fetchPrayers();
    const dailyCheckInterval = setInterval(checkAndFetchPrayers, 60000);
    const updateTimeInterval = setInterval(() => {
      if (isTestMode()) {
        setCurrentTime(prevTime => addSeconds(prevTime, 1));
      } else {
        setCurrentTime(new Date());
      }
    }, 1000);

    const checkPrayerProgIntval = setInterval(() => {
      checkPrayerProgress();
    }, 1000);

    onCleanup(() => {
      clearInterval(dailyCheckInterval);
      clearInterval(updateTimeInterval);
      clearInterval(checkPrayerProgIntval);
    });
  });

  const renderMainArea = () => {
    switch (displayMode()) {
      case DisplayMode.ADHAN:
        return <Adhan leadPrayer={memoizedLeadPrayer()} currentTime={currentTime()} />
      // case DisplayMode.PRAYER_TIME:
      //   return (
      //     <div class={styles.prayerTimeMessage}>It's prayer time!</div>
      //   );
      case DisplayMode.IQAMAH:
        return <Iqamah leadPrayer={memoizedLeadPrayer()} currentTime={currentTime()} />
      case DisplayMode.PRAYER_TIMES:
        return <PrayerTimes prayers={updatedPrayers()} />
      case DisplayMode.SETTINGS:
        return <TuneTimings />
      default:
        if (import.meta.env.VITE_DEV_MODE === 'true') {
          return <DevMode
            toggleTestSubuh={toggleTestSubuh}
            toggleTestSyuruk={toggleTestSyuruk}
            toggleRefetch={toggleRefetch}
            lastApiTimestamp={lastApiTimestamp()}
            toggleDisplayMode={toggleDisplayMode}
          />
        }
        return <DefaultMainArea />
    }
  };

  return (
    <div class={styles.container} style={{ width: `${getWindowDimensions().width}px`, height: `${getWindowDimensions().height}px` }}>
      <button class={styles.btnMosqueName} onClick={() => toggleDisplayMode(DisplayMode.DEFAULT)}>
        {import.meta.env.VITE_MOSQUE_NAME}
      </button>
      <div class={styles.mainArea}>
        {renderMainArea()}
      </div>
      <BottomStrip prayers={updatedPrayers()} currentTime={currentTime()} isTestMode={isTestMode()} />
    </div>
  );
};

export default App;
