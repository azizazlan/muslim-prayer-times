import { createEffect, createResource, createSignal, createMemo, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";

import { usePrayerService } from './context/usePrayerService';

// Utils
import getWindowDimensions from './utils/getWindowDimensions';

// Screens
import { Default, Developer, DailyVerse, DailyHadith, Adhan, Iqamah, Notice, PrayerTimes, Settings } from './components/screens';


// Components
import TopToolbar from './components/TopToolbar/TopToolbar';
import BottomStrip from './components/BottomStrip/BottomStrip';

import { TestMode } from "./types/testMode";
import { Screen } from './types/screen';
import styles from './App.module.scss';
import { useThemeService } from './context/useThemeService';
import { ColorTheme } from './types/theme';

export type Locale = 'en' | 'es' | 'fr'; // Example locales, adjust as needed

export interface Dictionary {
  [key: string]: string; // Example structure, adjust as needed
}

export interface RawDictionary {
  [key: string]: string | { [key: string]: string }; // Adjust based on your actual structure
}

const LANGUAGE = import.meta.env.VITE_LANGUAGE;

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

  const { colorTheme } = useThemeService();
  const memoizedColorTheme = createMemo(() => colorTheme());
  const { screen, setScreen } = usePrayerService();
  const memoizedScreen = createMemo(() => screen());
  const [locale, setLocale] = createSignal<Locale>(LANGUAGE);
  const [dict] = createResource(locale, fetchDictionary);
  dict(); // => Dictionary | undefined
  const t = i18n.translator(dict);

  createEffect(() => {
    // Clear existing theme classes
    // document.body.classList.remove("light-theme", "dark-theme", "blue-theme");
    document.body.classList.remove(
      ColorTheme.BLACK_AND_WHITE,
      ColorTheme.BLUE_AND_WHITE,
      ColorTheme.PINK_AND_TIFFANY,
      ColorTheme.GREENGRASS_AND_FLIRTMAROON,
      ColorTheme.GREENGRASS_AND_BLACK,
      ColorTheme.GOLD_AND_BLUE,
      ColorTheme.FORESTBLUE_AND_REDWOORD,
      ColorTheme.RED_MONOCHROMATIC,
      ColorTheme.PINKGLAMOUR_MONOCHROMATIC,
      ColorTheme.GREY_MONOCHROMATIC,
    );
    // Add the current theme class
    document.body.classList.add(memoizedColorTheme());
  });

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.log(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const renderMainArea = () => {
    // console.log(screen());
    switch (screen()) {
      case Screen.ADHAN:
        return <Adhan />;
      case Screen.NOTICE:
        return <Notice />;
      case Screen.HOURS_BEFORE_ADHAN:
        return <Adhan />;
      case Screen.IQAMAH:
        return <Iqamah />;
      case Screen.PRAYER_TIMES:
        return <PrayerTimes />;
      case Screen.DAILY_VERSE:
        return <DailyVerse />;
      case Screen.DAILY_HADITH:
        return <DailyHadith />;
      case Screen.SETTINGS:
        return <Settings />;
      case Screen.DEVELOPER:
        return <Developer />;
      default:
        return <Default />;
    }
  };

  return (
    <div class={styles.container}>
      <TopToolbar toggleFullScreen={toggleFullScreen} />
      <div class={styles.mainArea}>
        {renderMainArea()}
      </div>
      <BottomStrip />
    </div>
  );
};

export default App;
