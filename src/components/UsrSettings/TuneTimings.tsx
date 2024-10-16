import { Component, createSignal, createMemo, For } from 'solid-js';
import { usePrayerService } from '../../context/usePrayerService';
import styles from './TuneTimings.module.scss';

interface TuneTimingsProps {
}

const TuneTimings: Component<TuneTimingsProps> = (props) => {

  const { timingConfig, setTimingConfig } = usePrayerService();
  const memoTimingConfig = createMemo(() => timingConfig());

  const handleChange = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement;
    setTimingConfig((prevConfig) => ({
      ...prevConfig,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div class={styles.tuneTimings}>
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
      <div>
        <div class={styles.currentConfigs}>
          <h5>Current Configuration:</h5>
          <pre>{JSON.stringify(props.timingConfig, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default TuneTimings;