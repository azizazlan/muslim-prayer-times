import { createSignal } from "solid-js";
import styles from './Settings.module.scss';
import GeneralSettings from "./GeneralSettings";
import TuneTimings from "./TuneTimings";
import ColorThemeSettings from "./ColorThemeSettings";
import EventForm from '../EventScreen/EventForm';
import EventList from "../EventScreen/EventList";

interface SettingsProps {
}

const Settings = (props: SettingsProps) => {
  // Signal to track the active tab
  const [activeTab, setActiveTab] = createSignal<"general" | "timings" | "colortheme" | "eventform">("general");

  // Helper function to switch tabs
  const handleTabClick = (tab: "general" | "timings" | "colortheme" | "eventform") => {
    setActiveTab(tab);
  };


  // EXPERINMENTING
  const [events, setEvents] = createSignal<Event[]>([]);

  const addEvent = (newEvent: Event) => {
    setEvents([...events(), newEvent]);
  };


  const removeEvent = (eventToBeRemoved: Event) => {
    // Update the events signal by filtering out the event that matches the `id`
    setEvents(events().filter(event => event.id !== eventToBeRemoved.id));
  };

  return (
    <div class={styles.container}>
      <div class={styles.tabBar}>
        <div
          onClick={() => handleTabClick("general")}
          class={activeTab() === 'general' ? styles.activeTabTitle : styles.tabTitle}
        >
          General
        </div>
        <div
          onClick={() => handleTabClick("timings")}
          class={activeTab() === 'timings' ? styles.activeTabTitle : styles.tabTitle}
        >
          Tune Timings
        </div>
        <div
          onClick={() => handleTabClick("colortheme")}
          class={activeTab() === 'colortheme' ? styles.activeTabTitle : styles.tabTitle}
        >
          Color themes
        </div>
        <div
          onClick={() => handleTabClick("eventform")}
          class={activeTab() === 'eventform' ? styles.activeTabTitle : styles.tabTitle}
        >
          Events
        </div>
      </div>

      <div class={styles.tabContents}>
        {activeTab() === "general" && (
          <GeneralSettings />
        )}
        {activeTab() === "timings" && (
          <TuneTimings />
        )}
        {activeTab() === "colortheme" && (
          <ColorThemeSettings />
        )}
        {activeTab() === "eventform" && (
          <div class={styles.eventSettingsContainer}>
            <EventForm addEvent={addEvent} />
            <EventList events={events()} removeEvent={removeEvent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;