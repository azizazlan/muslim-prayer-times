import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { addSeconds, subMinutes, parse, set, isBefore, isAfter, differenceInSeconds } from 'date-fns';
import { getByDay } from 'prayertiming';
import { Prayer, PrayerMode, PrayerName } from '../types/prayer';
import { TestMode } from '../types/testMode';
import { Screen } from '../types/screen';
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

const MOSQUE_NAME = import.meta.env.VITE_MOSQUE_NAME;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '10', 10);
const SWITCH_SLIDES = import.meta.env.VITE_SWITCH_SLIDES === 'true';
const SWITCH_SLIDES_INTERVAL_MS = parseInt(import.meta.env.VITE_SWITCH_SLIDES_INTERVAL_MS || '30000', 10); // Default 30 secs
const IQAMAH_INTERVAL_MINS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MINS || '12', 10);

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createSettingsServiceHook() {
  // Interface for the context value props
  interface ContextValueProps {
    enabledSlides: Accessor<boolean>;
    setEnabledSlides: (enables: boolean) => void;
    calculationMethod: Accessor<string>;
    setCalculationMethod: (method: string) => void;
    mosqueName: Accessor<string>;
    setMosqueName: (name: string) => void;
    locationName: Accessor<string>;
    setLocationName: (name: string) => void;
    latitude: Accessor<string>;
    setLatitude: (lat: string) => void;
    longitude: Accessor<string>;
    setLongitude: (long: string) => void;
    adhanLeadMins: Accessor<number>;
    setAdhanLeadMins: (mins: number) => void;
    slideIntervalMs: Accessor<number>;
    setSlideIntervalMs: (ms: number) => void;
    iqamahIntervalMins: Accessor<number>;
    setIqamahIntervalMins: (minutes: number) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const [enabledSlides, setEnabledSlides] = createSignal<boolean>(
      loadFromLocalStorage<boolean>("enabledSlides", true)
    );
    const [calculationMethod, setCalculationMethod] = createSignal<string>(
      loadFromLocalStorage<string>("calculationMethod", "JAKIM")
    );
    const [mosqueName, setMosqueName] = createSignal<string>(
      loadFromLocalStorage<string>("mosqueName", MOSQUE_NAME)
    );
    const [locationName, setLocationName] = createSignal<string>(
      loadFromLocalStorage<string>("locationName", "KOTA DAMANSARA, SELANGOR")
    );
    const [latitude, setLatitude] = createSignal<string>(
      loadFromLocalStorage<string>("latitude", LATITUDE)
    );
    const [longitude, setLongitude] = createSignal<string>(
      loadFromLocalStorage<string>("longitude", LONGITUDE)
    );
    const [adhanLeadMins, setAdhanLeadMins] = createSignal<number>(
      loadFromLocalStorage<number>("adhanLeadMins", ADHAN_LEAD_MINS)
    );
    const [slideIntervalMs, setSlideIntervalMs] = createSignal<number>(
      loadFromLocalStorage<number>("slideIntervalMs", SWITCH_SLIDES_INTERVAL_MS)
    );
    const [iqamahIntervalMins, setIqamahIntervalMins] = createSignal<number>(
      loadFromLocalStorage<number>("iqamahIntervalMins", IQAMAH_INTERVAL_MINS)
    );

    // Watch for changes and update localStorage accordingly
    createEffect(() => saveToLocalStorage("enabledSlides", enabledSlides()));
    createEffect(() => saveToLocalStorage("calculationMethod", calculationMethod()));
    createEffect(() => saveToLocalStorage("mosqueName", mosqueName()));
    createEffect(() => saveToLocalStorage("locationName", locationName()));
    createEffect(() => saveToLocalStorage("latitude", latitude()));
    createEffect(() => saveToLocalStorage("longitude", longitude()));
    createEffect(() => saveToLocalStorage("adhanLeadMins", adhanLeadMins()));
    createEffect(() => saveToLocalStorage("slideIntervalMs", slideIntervalMs()));
    createEffect(() => saveToLocalStorage("iqamahIntervalMins", iqamahIntervalMins()));

    // Clear function to reset the local storage
    const clear = () => {
      localStorage.clear();
      setEnabledSlides(true);
      setCalculationMethod("JAKIM");
      setMosqueName(MOSQUE_NAME);
      setLocationName("KOTA DAMANSARA, SELANGOR");
      setLatitude(LATITUDE);
      setLongitude(LONGITUDE);
      setAdhanLeadMins(ADHAN_LEAD_MINS);
      setSlideIntervalMs(SWITCH_SLIDES_INTERVAL_MS);
      setIqamahIntervalMins(IQAMAH_INTERVAL_MINS);
    };

    const value: ContextValueProps = {
      enabledSlides,
      setEnabledSlides,
      calculationMethod,
      setCalculationMethod,
      mosqueName,
      setMosqueName,
      locationName,
      setLocationName,
      latitude,
      setLatitude,
      longitude,
      setLongitude,
      adhanLeadMins,
      setAdhanLeadMins,
      slideIntervalMs,
      setSlideIntervalMs,
      iqamahIntervalMins,
      setIqamahIntervalMins,
      clear,
    };
    // Provide the context value to children components
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  // Hook to consume the context
  function useSettingsServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useSettingsServiceContext must be used within a SettingsServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useSettingsServiceContext,
  };
}

const { Provider, useSettingsServiceContext } = createSettingsServiceHook();
export { Provider as SettingsServiceProvider, useSettingsServiceContext as useSettingsService };
