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
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const [selectedDua, setSelectedDua] = createSignal<any | null>();
    const [duaIndex, setDuaIndex] = createSignal<number>(0);
    const [totalDuas,] = createSignal<number>(duas.length);


    createEffect(() => {
      setSelectedDua(duas[duaIndex()]);
    })

    const nextDua = () => {
      setDuaIndex(i => i + 1);
      setSelectedDua(duas[duaIndex()]);
    }

    function clear() {
    }

    const value: ContextValueProps = {
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
