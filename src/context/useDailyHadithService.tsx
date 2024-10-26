import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { ColorTheme } from "../types/theme";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";
import { HadithApiResponse } from '../types/hadith';
import { useDailyVerseService } from './useDailyVerseService';

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createDailyHadithServiceHook() {

  interface ContextValueProps {
    enableDailyHadith: Accessor<boolean>;
    setEnableDailyHadith: (enabled: boolean) => void;
    hadith: Accessor<any | null>;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const { isOnline } = useDailyVerseService();

    const [hadith, setHadith] = createSignal<any | null>(null)

    const [enableDailyHadith, setEnableDailyHadith] = createSignal<boolean>(
      loadFromLocalStorage<boolean>("enableDailyHadith", true)
    );

    createEffect(() => saveToLocalStorage("enableDailyHadith", enableDailyHadith()));

    const fetchRandomHadith = async () => {

      const endpoint = `https://www.hadithapi.com/public/api/hadiths?apiKey=${import.meta.env.VITE_HADITH_API_KEY}&paginate=100`;

      try {
        const response = await fetch(endpoint);
        const data: HadithApiResponse = await response.json();
        if (data.status === 200 && data.hadiths && data.hadiths.data) {
          // setHadiths(data.hadiths.data);
          if (data.hadiths.data.length > 0) {
            console.log(data.hadiths.data[0]);
            setHadith(data.hadiths.data[0]);
          }
        } else {
          console.error('Failed to fetch hadiths or unexpected data structure');
        }
      } catch (error) {
        console.error('Error fetching hadiths:', error);
      }
    }

    createEffect(() => {
      if (!isOnline()) {
        console.log("isOnline false and will not fetch daily hadith from api.alquran.cloud")
        return;
      }

      if (!enableDailyHadith()) {
        console.log("disabled and will not fetch daily from ")
        return;
      }

      // Define an async function to fetch the verse
      const fetchHadith = async () => {
        const result = await fetchRandomHadith(); // {{ edit_2 }}
        setHadith(result);
      };

      fetchHadith(); // Call the async function
    });

    const fetchNextRandHadith = async () => {
      // Define an async function to fetch the verse
      const result = await fetchRandomHadith(); // {{ edit_2 }}
      setHadith(prev => result);
      console.log("Updated hadith:", hadith());
    }


    function clear() {
      console.log("clear");
    }

    const value: ContextValueProps = {
      enableDailyHadith,
      setEnableDailyHadith,
      fetchNextRandHadith,
      hadith,
      clear,
    };
    // Provide the context value to children components
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  // Hook to consume the context
  function useDailyHadithServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useDailyHadithContext must be used within a DailyHadithServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useDailyHadithServiceContext,
  };
}

const { Provider, useDailyHadithServiceContext } = createDailyHadithServiceHook();
export { Provider as DailyHadithServiceProvider, useDailyHadithServiceContext as useDailyHadithService };
