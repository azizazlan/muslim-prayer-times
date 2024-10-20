import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { ColorTheme } from "../types/theme";

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createDailyVerseServiceHook() {
  // Interface for the context value props
  interface ContextValueProps {
    internetOk: Accessor<boolean>;
    setInternetOk: (ok: boolean) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  const [internetOk, setInternetOk] = createSignal<boolean>(true);
  const [verse, setVerse] = createSignal<any | null>(null)

  // longitude, setLongitudes the children
  function Provider(props: ProviderProps) {

    const checkInternetConnection = () => {
      setInternetOk(true);
    }

    const fetchVerse = () => {
      return {
        numberInSurah: 73,
        text: "وَهُوَ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ بِٱلْحَقِّ ۖ وَيَوْمَ يَقُولُ كُن فَيَكُونُ ۚ قَوْلُهُ ٱلْحَقُّ ۚ وَلَهُ ٱلْمُلْكُ يَوْمَ يُنفَخُ فِى ٱلصُّورِ ۚ عَٰلِمُ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ ۚ وَهُوَ ٱلْحَكِيمُ ٱلْخَبِي",
        surah: {
          number: 6,
          name: "سُورَةُ الأَنۡعَامِ",
          englishName: "Al-An'aam",
          englishNameTranslation: "The Cattle",
        },
        translation: {
          text: "He it is Who created the heavens and the earth in truth. In the day when He saith: Be! it is. His Word is the Truth, and His will be the Sovereignty on the day when the trumpet is blown. Knower of the Invisible and the Visible, He is the Wise, the Aware."
        },
        edition: {
          englishName: "Mohammed Marmaduke William Pickthall"
        },
      }
    }

    createEffect(() => {
      if (!internetOk()) return;
      const result = fetchVerse();
      setVerse(result);
    });

    function clear() {
      console.log("clear");
    }

    const value: ContextValueProps = {
      internetOk,
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
