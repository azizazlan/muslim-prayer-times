import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import MosqueEvent from '../types/mosqueEvent';

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createEventsServiceHook() {
  interface ContextValueProps {
    events: Accessor<MosqueEvent[]>;
    addEvent: (newEvent: MosqueEvent) => void;
    removeEvent: (newEvent: MosqueEvent) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const [events, setEvents] = createSignal<MosqueEvent[]>([]);

    const addEvent = (newEvent: MosqueEvent) => {
      setEvents([...events(), newEvent]);
    };

    const removeEvent = (eventToBeRemoved: MosqueEvent) => {
      setEvents(events().filter(event => event.id !== eventToBeRemoved.id));
    };

    createEffect(() => {
    });

    function clear() {
    }

    const value: ContextValueProps = {
      events,
      addEvent,
      removeEvent,
      clear,
    };
    // Provide the context value to children components
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  // Hook to consume the context
  function useEventsServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useEventsContext must be used within a EventsServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useEventsServiceContext,
  };
}

const { Provider, useEventsServiceContext } = createEventsServiceHook();
export { Provider as EventsServiceProvider, useEventsServiceContext as useEventsService };
