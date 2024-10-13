import { createSignal } from "solid-js";
import styles from './Settings.module.scss';
import TuneTimings from "./TuneTimings";

interface SettingsProps {
  timingConfig: { fajr: number; dhuhr: number; maghrib: number; isha: number };
  setTimingConfig: (config: { fajr: number; dhuhr: number; maghrib: number; isha: number }) => void;
  handleRefetch: () => void;
}

const Settings = (props: SettingsProps) => {
  // Signal to track the active tab
  const [activeTab, setActiveTab] = createSignal<"general" | "timings">("general");

  // Helper function to switch tabs
  const handleTabClick = (tab: "general" | "timings") => {
    setActiveTab(tab);
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
          Timings
        </div>
      </div>

      <div class={styles.tabContents}>
        {activeTab() === "general" && (
          <GeneralSettings />
        )}
        {activeTab() === "timings" && (
          <TuneTimings timingConfig={props.timingConfig} setTimingConfig={props.setTimingConfig}
            handleRefetch={props.toggleRefetch} />
        )}
      </div>
    </div>
  );
};

// Placeholder for General Settings
const GeneralSettings = () => {
  return (
    <div>
      <p>Configure general application settings here.</p>
    </div>
  );
};

export default Settings;