import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { addSeconds, subMinutes, parse } from 'date-fns';
import { getByDay } from 'prayertiming';
// import { Prayer } from '../types/prayer';

const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createServicePrayerHook() {
  // Interface for the context value props
  interface ContextValueProps {
    prayers: Accessor<[]>;
    leadPrayer: Accessor<{}>;
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
  const [prayers, setPrayers] = createSignal([]);
  const [leadPrayer, setLeadPrayer] = createSignal({} | null);
  const [secsUntilNextPrayer, setSecsUntilNextPrayer] = createSignal(0);

  // Provider component that wraps the children
  function Provider(props: ProviderProps) {

    createEffect(() => {
      fetchPrayerTimes();
    });

    createEffect(() => {
      const updateTimeInterval = setInterval(() => {
        setCurrentTime(prevTime => addSeconds(prevTime, 1));
      }, 1000);
      // Clean up the interval on component unmount
      onCleanup(() => clearInterval(updateTimeInterval));
    });

    function fetchPrayerTimes() {
      const prayerTimes = getByDay({
        date: currentTime(),
        long: LONGITUDE,
        lat: LATITUDE,
        method: 'JAKIM',
        timeFormat: '24h',
        config: timingConfig()
      });

      setPrayers(
        [
          { name: "Subuh", time: prayerTimes.fajr },
          { name: 'Syuruk', time: prayerTimes.sunrise },
          { name: 'Zohor', time: prayerTimes.dhuhr },
          { name: 'Asar', time: prayerTimes.asr },
          { name: 'Maghrib', time: prayerTimes.maghrib },
          { name: 'Isyak', time: prayerTimes.isha }
        ]);
    }

    function clear() {
      console.log("clear");
    }

    const value: ContextValueProps = {
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
