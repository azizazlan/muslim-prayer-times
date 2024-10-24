import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import MosqueEvent from '../types/mosqueEvent';
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createEventsServiceHook() {
  interface ContextValueProps {
    displayEvent: Accessor<MosqueEvent | null>;
    events: Accessor<MosqueEvent[]>;
    addEvent: (newEvent: MosqueEvent) => void;
    removeEvent: (newEvent: MosqueEvent) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const defaultEvents: MosqueEvent[] = []; // Default value for events

    const [events, setEvents] = createSignal<MosqueEvent[]>(
      loadFromLocalStorage<MosqueEvent[]>("events", defaultEvents)
    );
    const [displayEvent, setDisplayEvent] = createSignal<MosqueEvent | null>(null);

    const addEvent = (newEvent: MosqueEvent) => {
      setEvents([...events(), newEvent]);
    };

    const removeEvent = (eventToBeRemoved: MosqueEvent) => {
      setEvents(events().filter(event => event.id !== eventToBeRemoved.id));
    };

    const checkEvent = () => {
      const today = new Date();
      const todayDay = today.toLocaleString('en-US', { weekday: 'short' }); // e.g., "Mon", "Tue"

      console.log(events());
      // Get events for today
      const todayEvents = events().filter(event => {
        const eventDate = new Date(event.date).setHours(0, 0, 0, 0);
        const todayDate = today.setHours(0, 0, 0, 0);

        // Check if event repeats on today's weekday or it's a single-day event for today
        if (event.repeat) {
          return event.repeatDays.includes(todayDay);
        } else {
          return eventDate === todayDate;
        }
      });

      // Get the first event for today, if available
      const todayEvent = todayEvents.length > 0 ? todayEvents[0] : null;

      // Set the event for display if an event is found
      if (todayEvent) {
        setDisplayEvent(todayEvent);
        console.log(`Displaying event: ${todayEvent.id} - ${todayEvent.eventText}`);
      } else {
        setDisplayEvent(null); // Optionally clear displayEvent if no event is found
        console.log('No event found for today');
      }
    };

    createEffect(() => saveToLocalStorage("events", events()));

    createEffect(() => {
      const intervalId = setInterval(checkEvent, 30000);
      onCleanup(() => {
        clearInterval(intervalId);
      });
    });

    function clear() {
      setEvents([]);
    }

    const value: ContextValueProps = {
      displayEvent,
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
