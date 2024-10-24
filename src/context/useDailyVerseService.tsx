import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { ColorTheme } from "../types/theme";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createDailyVerseServiceHook() {

  interface ContextValueProps {
    enableDailyVerse: Accessor<boolean>;
    setEnableDailyVerse: (enabled: boolean) => void;
    isOnline: Accessor<boolean>;
    verse: Accessor<any | null>;
    setIsOnline: (ok: boolean) => void;
    fetchNextRandVerse: () => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const [isOnline, setIsOnline] = createSignal<boolean>(true);
    const [verse, setVerse] = createSignal<any | null>(null)

    const [enableDailyVerse, setEnableDailyVerse] = createSignal<boolean>(
      loadFromLocalStorage<boolean>("enableDailyVerse", true)
    );

    // Watch for changes and update localStorage accordingly
    createEffect(() => saveToLocalStorage("enableDailyVerse", enableDailyVerse()));

    const checkInternetConnection = async () => {
      try {
        // Attempt to fetch a small resource from a reliable server
        const response = await fetch("https://www.google.com/favicon.ico", {
          method: "HEAD",
          mode: "no-cors",
        });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        checkInternetConnection();
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check for internet connection
    checkInternetConnection();

    // Cleanup event listeners on component unmount
    onCleanup(() => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    });

    //https://api.alquran.cloud/v1/ayah/862/editions/quran-uthmani,en.asad,en.pickthall
    const fetchRandomVerse = async (verseNo: number) => {

      const endpoint = `https://api.alquran.cloud/v1/ayah/${verseNo}/editions/quran-uthmani,en.asad,en.pickthall`;

      try {
        const response = await fetch(endpoint);
        const responseBody = await response.json();

        const data = responseBody.data[0];
        const engData = responseBody.data[2]; //pickhall is at element 3

        return {
          text: data.text, // Quranic verse in arabic
          numberInSurah: engData.numberInSurah,
          surah: {
            ...engData.surah,
          },
          translation: {
            text: engData.text,
          },
          edition: {
            englishName: engData.edition.englishName,
          }
        }

      } catch (error) {
        console.log(error);
        return null;
      }
    }

    createEffect(() => {
      if (!isOnline()) {
        console.log("isOnline false and will not fetch daily from api.alquran.cloud")
        return;
      }

      if (!enableDailyVerse()) {
        console.log("disabled and will not fetch daily from api.alquran.cloud")
        return;
      }

      // Generate a random verse number between 1 and 6326
      const randomVerseNo = Math.floor(Math.random() * 6326) + 1; // {{ edit_1 }}

      // Define an async function to fetch the verse
      const fetchVerse = async () => {
        const result = await fetchRandomVerse(randomVerseNo); // {{ edit_2 }}
        setVerse(result);
      };

      fetchVerse(); // Call the async function
    });

    const fetchNextRandVerse = async () => {
      // Generate a random verse number between 1 and 6326
      const randomVerseNo = Math.floor(Math.random() * 6326) + 1; // {{ edit_1 }}
      // Define an async function to fetch the verse
      const result = await fetchRandomVerse(randomVerseNo); // {{ edit_2 }}
      setVerse(prev => result);
      console.log("Updated verse:", verse());
    }


    function clear() {
      console.log("clear");
    }

    const value: ContextValueProps = {
      enableDailyVerse,
      setEnableDailyVerse,
      isOnline,
      fetchNextRandVerse,
      verse,
      clear,
    };
    // Provide the context value to children components
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  // Hook to consume the context
  function useDailyVerseServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useDailyVerseContext must be used within a DailyVerseServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useDailyVerseServiceContext,
  };
}

const { Provider, useDailyVerseServiceContext } = createDailyVerseServiceHook();
export { Provider as DailyVerseServiceProvider, useDailyVerseServiceContext as useDailyVerseService };
