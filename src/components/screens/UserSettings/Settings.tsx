import { createEffect, createSignal, createMemo } from "solid-js";
import styles from './Settings.module.scss';
import GeneralSettings from "./GeneralSettings";
import TuneTimings from "./TuneTimings";
import ColorThemeSettings from "./ColorThemeSettings";
import NoticeForm from '../Notice/NoticeForm';
import NoticeList from "../Notice/NoticeList";

interface SettingsProps {
}

const Settings = (props: SettingsProps) => {
  // Signal to track the active tab
  const [activeTab, setActiveTab] = createSignal<"general" | "timings" | "colortheme" | "noticeform">("general");

  // Helper function to switch tabs
  const handleTabClick = (tab: "general" | "timings" | "colortheme" | "noticeform") => {
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
          Tune Timings
        </div>
        <div
          onClick={() => handleTabClick("colortheme")}
          class={activeTab() === 'colortheme' ? styles.activeTabTitle : styles.tabTitle}
        >
          Color themes
        </div>
        <div
          onClick={() => handleTabClick("noticeform")}
          class={activeTab() === 'noticeform' ? styles.activeTabTitle : styles.tabTitle}
        >
          Notices
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
        {activeTab() === "noticeform" && (
          <div class={styles.noticeSettingsContainer}>
            <NoticeForm />
            <NoticeList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;