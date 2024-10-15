import { createEffect, createResource, createSignal, createMemo, onCleanup } from 'solid-js';
import { addSeconds, subMinutes, parse } from 'date-fns';
import type { Component } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";
// Utils
import getWindowDimensions from './utils/getWindowDimensions';
import { getPrayerTime } from './utils/prayers';

// Components
import Sleep from './components/Sleep';
import Adhan from './components/Adhan';
import Iqamah from './components/Iqamah';
import BottomStrip from './components/BottomStrip';
import DefaultMainArea from './components/DefaultMainArea';
import DevMode from './components/DevMode';
import Settings from './components/UsrSettings/Settings';
import PrayerTimes from './components/PrayerTimes';
import { DisplayMode } from "./types/displaymode";
import { TestMode } from "./types/testMode";
import styles from './App.module.scss';

const LANGUAGE = import.meta.env.VITE_LANGUAGE;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;


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
  const [currentTime, setCurrentTime] = createSignal(new Date());
  const [hasUpdatedTestTime, setHasUpdatedTestTime] = createSignal(false);
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>(DisplayMode.DEFAULT);
  const [testMode, setTestMode] = createSignal<DisplayMode>(TestMode.DEACTIVATED);
  const [timingConfig, setTimingConfig] = createSignal({
    fajr: 17.7,
    dhuhr: 1.2,
    maghrib: 1.1,
    isha: 18.3,
  });
  const memoizedTimingConfig = createMemo(() => timingConfig());

  const toggleDisplayMode = (mode: DisplayMode) => {
    if (mode === DisplayMode.DEFAULT) {
      window.location.reload();
    }
    setDisplayMode(mode);
  };

  const toggleTestScreenIqamah = () => {
    setDisplayMode(DisplayMode.IQAMAH);
  };

  const toggleRefetch = () => {

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

  const toggleTest = (testMode: TestMode) => {
    setTestMode(testMode);
  };

  const renderMainArea = () => {
    switch (displayMode()) {
      case DisplayMode.ADHAN:
        return <Adhan currentTime={currentTime()} />
      case DisplayMode.IQAMAH:
        return <Iqamah currentTime={currentTime()} />
      case DisplayMode.PRAYER_TIMES:
        return <PrayerTimes prayers={updatedPrayers()} />
      case DisplayMode.SETTINGS:
        return <Settings
          timingConfig={timingConfig()} setTimingConfig={setTimingConfig}
          handleRefetch={toggleRefetch}
        />
      case DisplayMode.SLEEP:
        return <Sleep />
      case DisplayMode.DEV:
        return <DevMode
          toggleTest={toggleTest}
          toggleRefetch={toggleRefetch}
          toggleDisplayMode={toggleDisplayMode}
        />
      default:
        return <DefaultMainArea />
    }
  };

  const updateTimeInterval = setInterval(() => {
    if (testMode() === TestMode.TEST_SUBUH && !hasUpdatedTestTime()) {
      let subuhTime = getPrayerTime({ name: 'Subuh' });
      subuhTime = parse(subuhTime, 'HH:mm', new Date());
      setCurrentTime(subuhTime);
      let nMinuteBeforeSubuh = subMinutes(subuhTime, ADHAN_LEAD_MINS_TEST);
      nMinuteBeforeSubuh = addSeconds(nMinuteBeforeSubuh, 55); // Make it quicker I can't wait one minute!
      setCurrentTime(nMinuteBeforeSubuh);
      setHasUpdatedTestTime(true);
    }
    else {
      setCurrentTime(prevTime => addSeconds(prevTime, 1));
    }


  }, 1000);

  // Clean up the interval on component unmount
  onCleanup(() => clearInterval(updateTimeInterval));

  return (
    <div class={styles.container} style={{ width: `${getWindowDimensions().width}px`, height: `${getWindowDimensions().height}px` }}>
      <div class={styles.topLeftButtons}>
        <button class={styles.btnDev} onClick={() => toggleDisplayMode(DisplayMode.ADHAN)}>Home</button>
        <button class={styles.btnMosqueName} onClick={() => toggleDisplayMode(DisplayMode.DEFAULT)}>
          {import.meta.env.VITE_MOSQUE_NAME}
        </button>
        <button class={styles.btnDev} onClick={() => toggleDisplayMode(DisplayMode.DEV)}>Dev</button>
      </div>
      <div class={styles.mainArea}>
        {renderMainArea()}
      </div>
      <Show fallback={<div>Loading...</div>} when={currentTime()}>
        <BottomStrip testMode={testMode()} currentTime={currentTime()} timingConfig={memoizedTimingConfig()} />
      </Show>
    </div>
  );
};

export default App;
