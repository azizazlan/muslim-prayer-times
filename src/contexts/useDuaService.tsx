import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";
import { NoticeProp } from "../types";
import duas from "./duas";

interface ProviderProps {
  children: JSX.Element;
}

export function createDuaServiceHook() {
  interface ContextValueProps {
    selectedDua: Accessor<any | null>;
    nextDua: () => void;
    duaIndex: Accessor<number>;
    totalDuas: Accessor<number>;
    displayDua: Accessor<boolean>;
    setDisplayDua: (enable: boolean) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const [selectedDua, setSelectedDua] = createSignal<any | null>();
    const [duaIndex, setDuaIndex] = createSignal<number>(Math.floor(Math.random() * duas.length));
    const [totalDuas,] = createSignal<number>(duas.length);
    const [displayDua, setDisplayDua] = createSignal<boolean>(
      loadFromLocalStorage<boolean>("displayDua", true)
    );

    // Watch for changes and update localStorage accordingly
    createEffect(() => saveToLocalStorage("displayDua", displayDua()));

    createEffect(() => {
      setSelectedDua(duas[duaIndex()]);
    })

    const nextDua = () => {
      const randomIndex = Math.floor(Math.random() * duas.length);
      setSelectedDua(duas[randomIndex]);
      setDuaIndex(randomIndex);
    }

    function clear() {
    }

    const value: ContextValueProps = {
      displayDua,
      setDisplayDua,
      selectedDua,
      nextDua,
      duaIndex,
      totalDuas,
      clear,
    };
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  function useDuaServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useDuaContext must be used within a DuaServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useDuaServiceContext,
  };
}

const { Provider, useDuaServiceContext } = createDuaServiceHook();
export { Provider as DuaServiceProvider, useDuaServiceContext as useDuaService };
