import { Component, createSignal, For } from 'solid-js';
import styles from './TuneTimings.module.scss';

interface TuneTimingsProps {
  timingConfig: { fajr: number; dhuhr: number; maghrib: number; isha: number };
  setTimingConfig: (config: { fajr: number; dhuhr: number; maghrib: number; isha: number }) => void;
  handleRefetch: () => void;
}

const TuneTimings: Component<TuneTimingsProps> = (props) => {

  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;
    props.setTimingConfig((prevConfig) => ({
      ...prevConfig,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div class={styles.tuneTimings}>
      <div>
        <h2>Tune Prayer Timings</h2>
        <div class={styles.tuneInput}>
          <label class={styles.tuneLabel}>
            Fajr:
          </label>
          <input type="number" name="fajr" value={props.timingConfig.fajr} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneInput}>
          <label class={styles.tuneLabel}>
            Dhuhr:
          </label>
          <input type="number" name="dhuhr" value={props.timingConfig.dhuhr} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneInput}>
          <label class={styles.tuneLabel}>
            Maghrib:
          </label>
          <input type="number" name="maghrib" value={props.timingConfig.maghrib} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneInput}>
          <label class={styles.tuneLabel}>
            Isha:
          </label>
          <input type="number" name="isha" value={props.timingConfig.isha} onInput={handleChange} step="0.1" />
        </div>
        <div class={styles.tuneButtons}>
          <button class={styles.testButton} onClick={props.handleRefetch}>REFETCH</button>
          <button class={styles.testButton} onClick={props.handleSave}>SAVE</button>
        </div>
      </div>
      <div>
        <div class={styles.currentConfigs}>
          <h3>Current Configuration:</h3>
          <pre>{JSON.stringify(props.timingConfig, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default TuneTimings;