import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { addSeconds, subMinutes, parse, set } from 'date-fns';
import { getByDay } from 'prayertiming';
import { Prayer, PrayerMode } from '../types/prayer';
import { TestMode } from '../types/testMode';

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
  const [prayers, setPrayers] = createSignal(Array<Prayer>);
  const [leadPrayer, setLeadPrayer] = createSignal<Prayer | null>(null);
  const [secsUntilNextPrayer, setSecsUntilNextPrayer] = createSignal(0);
  const [test, setTest] = createSignal(TestMode.DEACTIVATED);
  const [isTestInProgress, setIsTestInProgress] = createSignal(false);

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
            const now = new Date();
            const [hours, minutes] = subuhPrayer.time.split(':').map(Number);
            let subuhTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
            if (subuhTime < currentTime()) {
              subuhTime = set(subuhTime, { date: subuhTime.getDate() + 1 });
            }
            let nMinuteBeforeSubuh = subMinutes(subuhTime, ADHAN_LEAD_MINS_TEST);
            nMinuteBeforeSubuh = addSeconds(nMinuteBeforeSubuh, 50);
            setCurrentTime(nMinuteBeforeSubuh);
          }
        } else {
          setCurrentTime(new Date());
        }
        setCurrentTime(prevTime => addSeconds(prevTime, 1));
      }, 1000);
      // Clean up the interval on component unmount
      onCleanup(() => clearInterval(updateTimeInterval));
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

    function clear() {
      console.log("clear");
    }

    const value: ContextValueProps = {
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
