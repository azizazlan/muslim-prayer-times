import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { addSeconds, subMinutes, parse, set, isBefore, isAfter, differenceInSeconds } from 'date-fns';
import { getByDay } from 'prayertiming';
import { Prayer, PrayerMode, PrayerName } from '../types/prayer';
import { TestMode } from '../types/testMode';
import { Screen } from '../types/screen';

const MOSQUE_NAME = import.meta.env.VITE_MOSQUE_NAME;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '15', 10);
const SWITCH_SLIDES = import.meta.env.VITE_SWITCH_SLIDES === 'true';
const SWITCH_SLIDES_INTERVAL_MS = parseInt(import.meta.env.VITE_SWITCH_SLIDES_INTERVAL_MS || '30000', 10); // Default 30 secs
const IQAMAH_INTERVAL_MS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MS || '720000', 10);

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
    iqamahIntervalMs: Accessor<number>;
    setIqamahIntervalMs: (ms: number) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  const [enabledSlides, setEnabledSlides] = createSignal<boolean>(true);
  const [calculationMethod, setCalculationMethod] = createSignal<string>("JAKIM");
  const [mosqueName, setMosqueName] = createSignal<string>(MOSQUE_NAME);
  const [locationName, setLocationName] = createSignal<string>("KOTA DAMANSARA, SELANGOR");
  const [latitude, setLatitude] = createSignal<string>(LATITUDE);
  const [longitude, setLongitude] = createSignal<string>(LONGITUDE);
  const [adhanLeadMins, setAdhanLeadMins] = createSignal<string>(ADHAN_LEAD_MINS);
  const [slideIntervalMs, setSlideIntervalMs] = createSignal<number>(SWITCH_SLIDES_INTERVAL_MS);
  const [iqamahIntervalMs, setIqamahIntervalMs] = createSignal<number>(IQAMAH_INTERVAL_MS);

  // longitude, setLongitudes the children
  function Provider(props: ProviderProps) {

    createEffect(() => {
    });


    function clear() {
      console.log("clear");
    }

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
      iqamahIntervalMs,
      setIqamahIntervalMs,
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
