import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";
import { NoticeProp } from "../types";

interface ProviderProps {
  children: JSX.Element;
}

export function createNoticeServiceHook() {
  interface ContextValueProps {
    displayNotice: Accessor<boolean>;
    setDisplayNotice: (enable: boolean) => void;
    selectedNotice: Accessor<NoticeProp | null>;
    notices: Accessor<NoticeProp[]>;
    addNotice: (newNotice: NoticeProp) => void;
    removeNotice: (removeNotice: NoticeProp) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const defaultNotices: NoticeProp[] = []; // Default value for events

    const [displayNotice, setDisplayNotice] = createSignal<boolean>(
      loadFromLocalStorage<boolean>("displayNotice", true)
    );
    // Watch for changes and update localStorage accordingly
    createEffect(() => saveToLocalStorage("displayNotice", displayNotice()));

    const [notices, setNotices] = createSignal<NoticeProp[]>(
      loadFromLocalStorage<NoticeProp[]>("notices", defaultNotices)
    );
    const [selectedNotice, setSelectedNotice] = createSignal<NoticeProp | null>(null);

    const addNotice = (newNotice: NoticeProp) => {
      setNotices([...notices(), newNotice]);
    };

    const removeNotice = (noticeToBeRemoved: NoticeProp) => {
      setNotices(notices().filter(notice => notice.id !== noticeToBeRemoved.id));
    };

    const checkNotice = () => {
      const today = new Date();
      const todayDay = today.toLocaleString('en-US', { weekday: 'short' }); // e.g., "Mon", "Tue"

      // Get events for today
      const todayNotices = notices().filter(notice => {
        const noticeDate = new Date(notice.date).setHours(0, 0, 0, 0);
        const todayDate = today.setHours(0, 0, 0, 0);

        if (notice.repeat) {
          return notice.repeatDays.includes(todayDay);
        } else {
          return noticeDate === todayDate;
        }
      });

      const todayNotice = todayNotices.length > 0 ? todayNotices[0] : null;

      if (todayNotice) {
        setDisplayNotice(todayNotice);
        console.log(`Displaying notice: ${todayNotice.id} - ${todayNotice.noticeText}`);
      } else {
        setDisplayNotice(null);
        console.log('No notice found for today');
      }
    };

    createEffect(() => saveToLocalStorage("notices", notices()));

    createEffect(() => {
      const intervalId = setInterval(checkNotice, 30000);
      onCleanup(() => {
        clearInterval(intervalId);
      });
    });

    function clear() {
      setNotices([]);
    }

    const value: ContextValueProps = {
      displayNotice,
      setDisplayNotice,
      selectedNotice,
      notices,
      addNotice,
      removeNotice,
      clear,
    };
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  function useNoticeServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useNoticeContext must be used within a NoticeServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useNoticeServiceContext,
  };
}

const { Provider, useNoticeServiceContext } = createNoticeServiceHook();
export { Provider as NoticeServiceProvider, useNoticeServiceContext as useNoticeService };
