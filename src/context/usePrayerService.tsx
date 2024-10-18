import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { addSeconds, subMinutes, parse, set, isBefore, isAfter, differenceInSeconds } from 'date-fns';
import { getByDay } from 'prayertiming';
import { Prayer, PrayerMode, PrayerName } from '../types/prayer';
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
    midnight: 'Standard',
    highLats: 'NightMiddle'
  });

  const [currentTime, setCurrentTime] = createSignal(new Date());
  const [prayers, setPrayers] = createSignal<Prayer[]>([]); // Initialize as an empty array
  const [leadPrayer, setLeadPrayer] = createSignal<Prayer | null>(null);
  // secsUntilNextPrayer is used in the Adhan component
  const [secsUntilNextPrayer, setSecsUntilNextPrayer] = createSignal(0);
  const [test, setTest] = createSignal(TestMode.DEACTIVATED);
  const [isTestInProgress, setIsTestInProgress] = createSignal(false);
  const [screen, setScreen] = createSignal(Screen.DEFAULT);

  const [switchingDisplays, setSwitchingDisplays] = createSignal(false);

  // Provider component that wraps the children
  function Provider(props: ProviderProps) {

    createEffect(() => {
      fetchPrayerTimes();
    });

    const switchComponent = () => {

      const currentPrayer = prayers().find(prayer => prayer.mode === PrayerMode.ACTIVE);
      if (!currentPrayer) {
        console.log("Abort switchComponent because currentPrayer is null");
        return;
      }
      console.log(`currentPrayer.name: ${currentPrayer.name} timing ${currentPrayer.time}`);
      const secsAfterPrayer = differenceInSeconds(currentTime(), getPrayerTime(currentPrayer.name));
      console.log(`secsAfterPrayer: ${secsAfterPrayer} ${secsAfterPrayer / 60} mins`);

      // Do not switch if seconds after prayer time is still under 20 mins (1200 ms)
      if ((screen() === Screen.ADHAN || screen() === Screen.IQAMAH) && secsAfterPrayer < 1200) return;

      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // Cycle through the components
      // console.log(currentIndex());
      if (currentIndex() == 0 && currentPrayer.name !== 'Isyak') {
        setScreen(Screen.HOURS_BEFORE_ADHAN);
      }
      if (currentIndex() == 2) {
        setScreen(Screen.PRAYER_TIMES);
        return;
      }
      if (currentIndex() == 1) {
        setScreen(Screen.DEFAULT);
        return;
      }
    };

    createEffect(() => {
      // Set up an interval to switch components every minute (60000 milliseconds)
      const intervalId = setInterval(switchComponent, 30000);
      onCleanup(() => {
        clearInterval(intervalId);
        // clearInterval(toggleScreensInterval); // Clear the new interval
      });
    });

    createEffect(() => {

      const updateTimeInterval = setInterval(() => {

        if (test() === TestMode.TEST_SUBUH) {
          if (!isTestInProgress()) {
            setIsTestInProgress(true);
            const subuhPrayer = prayers().find(prayer => prayer.name === PrayerName.SUBUH);
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
            let nMinuteBeforeSubuh = subMinutes(subuhTime, ADHAN_LEAD_MINS_TEST);
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
      });
    });

    const [currentIndex, setCurrentIndex] = createSignal(0);

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
          { name: PrayerName.SUBUH, time: `${prayerTimes.fajr}`, mode: PrayerMode.INACTIVE },
          { name: PrayerName.SYURUK, time: `${prayerTimes.sunrise}`, mode: PrayerMode.INACTIVE },
          { name: PrayerName.ZOHOR, time: `${prayerTimes.dhuhr}`, mode: PrayerMode.INACTIVE },
          { name: PrayerName.ASAR, time: `${prayerTimes.asr}`, mode: PrayerMode.INACTIVE },
          { name: PrayerName.MAGHRIB, time: `${prayerTimes.maghrib}`, mode: PrayerMode.INACTIVE },
          { name: PrayerName.ISYAK, time: `${prayerTimes.isha}`, mode: PrayerMode.INACTIVE }
        ]);
    }

    function getPrayerTime(name: String) {
      const p = (prayers() as Array<Prayer>).find((prayer: Prayer) => prayer.name === name);
      if (!p) return new Date();
      return parse(p.time, 'HH:mm', currentTime());
    }

    // updatePrayerProgress will be called every second
    function updatePrayerProgress() {
      const updatedPrayers = (prayers() as Array<Prayer>).map((prayer: Prayer) => {
        // Create a new object for each prayer to avoid direct mutation
        const updatedPrayer = { ...prayer };

        if (updatedPrayer.name === PrayerName.SUBUH) {
          const subuhTime = getPrayerTime(PrayerName.SUBUH);
          const syurukTime = getPrayerTime(PrayerName.SYURUK);

          // seconds after subuh is used so that we do not want to display "Luruskan saf" for too long!
          // In the logic below we only display Iaqamah for 15 mins (900 ms) 
          const secsAfterSubuh = differenceInSeconds(currentTime(), subuhTime);

          if (isBefore(currentTime(), subuhTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            setLeadPrayer(updatedPrayer);
            const secs = differenceInSeconds(subuhTime, currentTime());
            setSecsUntilNextPrayer(secs);
            if (secs < ADHAN_LEAD_MINS * 60) { // display ADHAN when less 15 mins
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), subuhTime) && isBefore(currentTime(), syurukTime) && secsAfterSubuh < 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
            setScreen(Screen.IQAMAH);
          } else if (isAfter(currentTime(), subuhTime) && isBefore(currentTime(), syurukTime) && secsAfterSubuh > 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          }
          else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === PrayerName.ZOHOR) {
          const syurukTime = getPrayerTime(PrayerName.SYURUK);
          const zohorTime = getPrayerTime(PrayerName.ZOHOR);
          const asarTime = getPrayerTime(PrayerName.ASAR);

          const secsAfterZohor = differenceInSeconds(currentTime(), zohorTime);

          if (isAfter(currentTime(), syurukTime) && isBefore(currentTime(), zohorTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(zohorTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < ADHAN_LEAD_MINS * 60) {
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), zohorTime) && isBefore(currentTime(), asarTime) && secsAfterZohor < 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
            setScreen(Screen.IQAMAH);
          } else if (isAfter(currentTime(), zohorTime) && isBefore(currentTime(), asarTime) && secsAfterZohor > 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          }
          else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === PrayerName.ASAR) {
          const zohorTime = getPrayerTime(PrayerName.ZOHOR);
          const asarTime = getPrayerTime(PrayerName.ASAR);
          const maghribTime = getPrayerTime(PrayerName.MAGHRIB);

          const secsAfterAsar = differenceInSeconds(currentTime(), asarTime);

          if (isAfter(currentTime(), zohorTime) && isBefore(currentTime(), asarTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(asarTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < ADHAN_LEAD_MINS * 60) {
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), asarTime) && isBefore(currentTime(), maghribTime) && secsAfterAsar < 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
            setScreen(Screen.IQAMAH);
          } else if (isAfter(currentTime(), asarTime) && isBefore(currentTime(), maghribTime) && secsAfterAsar > 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          }
          else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === PrayerName.MAGHRIB) {
          const asarTime = getPrayerTime(PrayerName.ASAR);
          const maghribTime = getPrayerTime(PrayerName.MAGHRIB);
          const isyakTime = getPrayerTime(PrayerName.ISYAK);

          const secsAfterMaghrib = differenceInSeconds(currentTime(), maghribTime);

          if (isAfter(currentTime(), asarTime) && isBefore(currentTime(), maghribTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(maghribTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < ADHAN_LEAD_MINS * 60) {
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), maghribTime) && isBefore(currentTime(), isyakTime) && secsAfterMaghrib < 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
            setScreen(Screen.IQAMAH);
          }
          else if (isAfter(currentTime(), maghribTime) && isBefore(currentTime(), isyakTime) && secsAfterMaghrib > 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          }
          else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        if (updatedPrayer.name === PrayerName.ISYAK) {
          const maghribTime = getPrayerTime(PrayerName.MAGHRIB);
          const isyakTime = getPrayerTime(PrayerName.ISYAK);

          const secsAfterIsyak = differenceInSeconds(currentTime(), isyakTime);

          if (isAfter(currentTime(), maghribTime) && isBefore(currentTime(), isyakTime)) {
            updatedPrayer.mode = PrayerMode.IMMEDIATE_NEXT;
            const secs = differenceInSeconds(isyakTime, currentTime());
            setSecsUntilNextPrayer(secs);
            setLeadPrayer(updatedPrayer);
            if (secs < ADHAN_LEAD_MINS * 60) {
              setScreen(Screen.ADHAN);
            }
          } else if (isAfter(currentTime(), isyakTime) && secsAfterIsyak < 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
            setScreen(Screen.IQAMAH);
          }
          else if (isAfter(currentTime(), isyakTime) && secsAfterIsyak > 900) {
            updatedPrayer.mode = PrayerMode.ACTIVE;
          }
          else {
            updatedPrayer.mode = PrayerMode.INACTIVE;
          }
        }

        return updatedPrayer;
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
