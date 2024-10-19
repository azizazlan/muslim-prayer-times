import { Component, createSignal, createMemo, For } from 'solid-js';
import { usePrayerService } from '../../context/usePrayerService';
import styles from './TuneTimings.module.scss';

interface TimingConfig {
  fajr: number;
  dhuhr: number;
  maghrib: number;
  isha: number;
  midnight: string;
  highLats: string;
}

interface TuneTimingsProps {
}

const TuneTimings: Component<TuneTimingsProps> = (props) => {

  const { timingConfig, setTimingConfig } = usePrayerService();
  const memoTimingConfig = createMemo(() => timingConfig());

  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;

    // Ensure the name is a key of TimingConfig
    setTimingConfig((prevConfig: TimingConfig) => {
      const updatedConfig = { ...prevConfig as TimingConfig }; // Copy the previous config
      const key = name as keyof TimingConfig;

      const parsedValue = parseFloat(value.toString());
      if (isNaN(parsedValue)) return updatedConfig; // Return early if value is not a number

      updatedConfig[key] = parseFloat(parsedValue); // Ensure value is a number
      return updatedConfig;
    });
  };

  return (
    <div class={styles.container}>
      <div>
        <div class={styles.tuneField}>
          <label class={styles.tuneLabel}>
            Subuh
          </label>
          <input class={styles.tuneInput} type="number" name="fajr" value={memoTimingConfig().fajr} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneField}>
          <label class={styles.tuneLabel}>
            Zohor
          </label>
          <input class={styles.tuneInput} type="number" name="dhuhr" value={memoTimingConfig().dhuhr} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneField}>
          <label class={styles.tuneLabel}>
            Maghrib
          </label>
          <input class={styles.tuneInput} type="number" name="maghrib" value={memoTimingConfig().maghrib} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneField}>
          <label class={styles.tuneLabel}>
            Isyak
          </label>
          <input class={styles.tuneInput} type="number" name="isha" value={memoTimingConfig().isha} onInput={handleChange} step="0.1" />
        </div>
      </div>
      <input class={styles.tuneInput} name="midnight" value="Standard" onInput={handleChange} />
      <input class={styles.tuneInput} name="highLats" value="NightMiddle" onInput={handleChange} />
      <div>
        <div class={styles.currentConfigs}>
          <div>Current Configuration</div>
          <pre>{JSON.stringify(timingConfig(), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default TuneTimings;