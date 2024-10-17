import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { addSeconds, subMinutes, parse, set, isBefore, isAfter, differenceInSeconds } from 'date-fns';
import { getByDay } from 'prayertiming';
import { Prayer, PrayerMode } from '../types/prayer';
import { TestMode } from '../types/testMode';
import { Screen } from '../types/screen';

const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '13', 10);
const ADHAN_LEAD_MINS_TEST = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS_TEST || '1', 10);

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createServicePrayerHook() {
  // Interface for the context value props
  interface ContextValueProps {
    screen: Accessor<string>;
    setScreen: (screen: Screen) => void;
    test: Accessor<TestMode>;
    setTest: (testMode: TestMode) => void;
    prayers: Accessor<Array<Prayer>>;
    leadPrayer: Accessor<Prayer | null>;
    currentTime: Accessor<Date>;
    secsUntilNextPrayer: Accessor<number>;
    timingConfig: Accessor<{ fajr: number; dhuhr: number; maghrib: number; isha: number }>;
    setTimingConfig: (newConfig: { fajr: number; dhuhr: number; maghrib: number; isha: number }) => void; // Expose setter
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  const [timingConfig, setTimingConfig] = createSignal({
    fajr: 17.7,
    dhuhr: 1.2,
    maghrib: 1.1,
    isha: 18.3,
  });
  const [currentTime, setCurrentTime] = createSignal(new Date());
  const [prayers, setPrayers] = createSignal<Array<Prayer>>([]); // Initialize as an empty array
  const [leadPrayer, setLeadPrayer] = createSignal<Prayer | null>(null);
  const [secsUntilNextPrayer, setSecsUntilNextPrayer] = createSignal(0);
  const [test, setTest] = createSignal(TestMode.DEACTIVATED);
  const [isTestInProgress, setIsTestInProgress] = createSignal(false);
  const [screen, setScreen] = createSignal(Screen.DEFAULT);


  // Provider component that wraps the children
  function Provider(props: ProviderProps) {

    createEffect(() => {
      fetchPrayerTimes();
    });

    createEffect(() => {

      const updateTimeInterval = setInterval(() => {

        if (test() === TestMode.TEST_SUBUH) {
          if (!isTestInProgress()) {
            setIsTestInProgress(true);
            const subuhPrayer = prayers().find(prayer => prayer.name === 'Subuh');
            if (!subuhPrayer) {
              console.log('subuhPrayer is null');
              return;
            }

            const now = new Date();
            const [hours, minutes] = subuhPrayer.time.split(':').map(Number);
            let subuhTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
            if (subuhTime < currentTime()) {
              subuhTime = set(subuhTime, { date: subuhTime.getDate() + 1 });
            }
            let nMinuteBeforeSubuh = subMinutes(subuhTime, ADHAN_LEAD_MINS + 1);
            nMinuteBeforeSubuh = addSeconds(nMinuteBeforeSubuh, 55);
            setCurrentTime(nMinuteBeforeSubuh);
          }
        } else {
          setCurrentTime(new Date());
        }
        setCurrentTime(prevTime => addSeconds(prevTime, 1));
        updatePrayerProgress();
      }, 1000);

      onCleanup(() => {
        clearInterval(updateTimeInterval);
        // clearInterval(toggleScreensInterval); // Clear the new interval
      });
    });

    const date = currentTime();

    function fetchPrayerTimes() {
      const prayerTimes = getByDay({
        date,
        long: LONGITUDE,
        lat: LATITUDE,
        method: 'JAKIM',
        timeFormat: '24h',
        config: timingConfig()
      });

      setPrayers(
        [
          { name: "Subuh", time: prayerTimes.fajr, mode: PrayerMode.INACTIVE },
          { name: 'Syuruk', time: prayerTimes.sunrise, mode: PrayerMode.INACTIVE },
          { name: 'Zohor', time: prayerTimes.dhuhr, mode: PrayerMode.INACTIVE },
          { name: 'Asar', time: prayerTimes.asr, mode: PrayerMode.INACTIVE },
          { name: 'Maghrib', time: prayerTimes.maghrib, mode: PrayerMode.INACTIVE },
          { name: 'Isyak', time: prayerTimes.isha, mode: PrayerMode.INACTIVE }
        ]);
    }

    function getPrayerTime(name: String) {
      const p = (prayers() as Array<Prayer>).find((prayer: Prayer) => prayer.name === name);
      if (!p) return new Date();
      return parse(p.time, 'HH:mm', currentTime());
    }

    function updatePrayerProgress() {
      const updatedPrayers = (prayers() as Array<Prayer>).map((prayer: Prayer) => {
        // Create a new object for each prayer to avoid direct mutation
        const updatedPrayer = { ...prayer };

        if (updatedPrayer.name === 'Subuh') {
          const subuhTime = getPrayerTime("Subuh");
          const syurukTime = getPrayerTime('Syuruk');
          if (isBefore(currentTime(), subuhTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            setLeadPrayer(updatedPrayer);
            const secs = differenceInSeconds(subuhTime, currentTime());
            setSecsUntilNextPrayer(secs);
            if (secs < 1800) { // display ADHAN when less 30 mins
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), subuhTime) && isBefore(currentTime(), syurukTime)) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
            setScreen(Screen.IQAMAH);
            const secs = differenceInSeconds(subuhTime, currentTime());
          } else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === 'Zohor') {
          const syurukTime = getPrayerTime('Syuruk');
          const zohorTime = getPrayerTime('Zohor');
          const asarTime = getPrayerTime('Asar');
          if (isAfter(currentTime(), syurukTime) && isBefore(currentTime(), zohorTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(zohorTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < 1800) { // display ADHAN when less 30 mins
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), zohorTime) && isBefore(currentTime(), asarTime)) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          } else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === 'Asar') {
          const zohorTime = getPrayerTime('Zohor');
          const asarTime = getPrayerTime('Asar');
          const maghribTime = getPrayerTime('Maghrib');
          if (isAfter(currentTime(), zohorTime) && isBefore(currentTime(), asarTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(asarTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < 1800) { // display ADHAN when less 30 mins
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), asarTime) && isBefore(currentTime(), maghribTime)) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          } else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === 'Maghrib') {
          const asarTime = getPrayerTime('Asar');
          const maghribTime = getPrayerTime('Maghrib');
          const isyakTime = getPrayerTime('Isyak');
          if (isAfter(currentTime(), asarTime) && isBefore(currentTime(), maghribTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(maghribTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < 1800) { // display ADHAN when less 30 mins
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), maghribTime) && isBefore(currentTime(), isyakTime)) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          } else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === 'Isyak') {
          const maghribTime = getPrayerTime('Maghrib');
          const isyakTime = getPrayerTime('Isyak');
          if (isAfter(currentTime(), maghribTime) && isBefore(currentTime(), isyakTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(isyakTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < 1800) { // display ADHAN when less 30 mins
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), isyakTime)) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          } else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        return updatedPrayer; // Return the updated prayer object
      });
      // Update the state with the new array of updated prayers
      setPrayers(updatedPrayers);
    }

    function clear() {
      console.log("clear");
    }

    const value: ContextValueProps = {
      setScreen,
      screen,
      test,
      setTest,
      prayers,
      leadPrayer,
      currentTime,
      secsUntilNextPrayer,
      setTimingConfig,
      timingConfig,
      clear,
    };

    // Provide the context value to children components
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  // Hook to consume the context
  function useServicePrayerContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useRESTApi must be used within a RestAPIProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useServicePrayerContext,
  };
}

const { Provider, useServicePrayerContext } = createServicePrayerHook();
export { Provider as PrayerServiceProvider, useServicePrayerContext as usePrayerService };
