import { createEffect, createResource, createSignal, createMemo, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";

import { usePrayerService } from './context/usePrayerService';

// Utils
import getWindowDimensions from './utils/getWindowDimensions';
import { getPrayerTime, secsUntilNextPrayer } from './utils/prayers';

// Components
import Sleep from './components/Sleep';
import Adhan from './components/Adhan';
import Iqamah from './components/Iqamah';
import BottomStrip from './components/BottomStrip';
import DefaultMainArea from './components/DefaultMainArea';
import DevMode from './components/DevMode';
import Settings from './components/UsrSettings/Settings';
import PrayerTimes from './components/PrayerTimes';
import { TestMode } from "./types/testMode";
import { Screen } from './types/screen';
import styles from './App.module.scss';

const LANGUAGE = import.meta.env.VITE_LANGUAGE;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '13', 10);
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

  const { screen, setScreen, setTimeWarp } = usePrayerService();
  const memoizedScreen = createMemo(() => screen());
  const [locale, setLocale] = createSignal<Locale>(LANGUAGE);
  const [dict] = createResource(locale, fetchDictionary);
  dict(); // => Dictionary | undefined
  const t = i18n.translator(dict);

  const toggleScreen = (mode: Screen) => {
    if (mode === Screen.DEFAULT) {
      window.location.reload();
    }
    if (mode === Screen.FULLSCREEN) {
      toggleFullScreen();
      return;
    }
    setScreen(prev => mode);
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

  const renderMainArea = () => {

    switch (memoizedScreen()) {
      case Screen.ADHAN:
        return <Adhan />;
      case Screen.IQAMAH:
        return <Iqamah />;
      case Screen.PRAYER_TIMES:
        return <PrayerTimes />;
      case Screen.SETTINGS:
        return <Settings />;
      case Screen.DEV:
        return <DevMode />;
      default:
        return <DefaultMainArea />;
    }

  };

  return (
    <div class={styles.container} style={{ width: `${getWindowDimensions().width}px`, height: `${getWindowDimensions().height}px` }}>
      <div class={styles.topButtons}>
        <button class={styles.btnDev} onClick={() => toggleScreen(Screen.ADHAN)}>Home</button>
        <button class={styles.btnDev} onClick={() => toggleScreen(Screen.DEV)}>Dev</button>
        <button class={styles.btnDev} onClick={() => setTimeWarp(tw => !tw)}>Time Warp</button>
        <div class={styles.version}>Ver 1.0.0</div>
      </div>
      <div class={styles.mainArea}>
        {renderMainArea()}
      </div>
      <BottomStrip />
    </div>
  );
};

export default App;
