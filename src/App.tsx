import { createEffect, createResource, createSignal, createMemo, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";

import { usePrayerService } from './context/usePrayerService';

// Utils
import getWindowDimensions from './utils/getWindowDimensions';

// Components
import TopToolbar from './components/TopToolbar/TopToolbar';
import Adhan from './components/Adhan/Adhan';
import Iqamah from './components/Iqamah/Iqamah';
import BottomStrip from './components/BottomStrip/BottomStrip';
import DefaultMainArea from './components/DefaultMainArea/DefaultMainArea';
import DevMode from './components/DevMode/DevMode';
import Settings from './components/UsrSettings/Settings';
import PrayerTimes from './components/PrayerTimes/PrayerTimes';
import { TestMode } from "./types/testMode";
import { Screen } from './types/screen';
import styles from './App.module.scss';

export type Locale = 'en' | 'es' | 'fr'; // Example locales, adjust as needed

export interface Dictionary {
  [key: string]: string; // Example structure, adjust as needed
}

export interface RawDictionary {
  [key: string]: string | { [key: string]: string }; // Adjust based on your actual structure
}

const LANGUAGE = import.meta.env.VITE_LANGUAGE;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '13', 10);
const ADHAN_LEAD_MINS_TEST = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS_TEST || '1', 10);

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const module = await import(`./i18n/${locale}.ts`);
    if (module && module.dict) {
      const dict: RawDictionary = module.dict; // Ensure dict is of type RawDictionary
      const flattenedDict = i18n.flatten(dict) as Dictionary; // Cast to Dictionary if necessary
      return flattenedDict;
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

  const { screen, setScreen } = usePrayerService();
  const memoizedScreen = createMemo(() => screen());
  const [locale, setLocale] = createSignal<Locale>(LANGUAGE);
  const [dict] = createResource(locale, fetchDictionary);
  dict(); // => Dictionary | undefined
  const t = i18n.translator(dict);


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
      <TopToolbar />
      <div class={styles.mainArea}>
        {renderMainArea()}
      </div>
      <BottomStrip />
    </div>
  );
};

export default App;
