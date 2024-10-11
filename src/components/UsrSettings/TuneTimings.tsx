import { createSignal, For } from 'solid-js';
import styles from './TuneTimings.module.scss';

const prayerNames = ['Imsak', 'Subuh', 'Syuruk', 'Zuhur', 'Asar', 'Maghrib', 'Sunset', 'Isyak', 'Midnight'];

const TuneTimings = () => {
  const [tuneValues, setTuneValues] = createSignal(
    import.meta.env.VITE_TUNE.split(',').map(Number)
  );

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...tuneValues()];
    newValues[index] = parseInt(value, 10);
    setTuneValues(newValues);
  };

  const applySettings = () => {
    const newTuneString = tuneValues().join(',');
    // Here you would typically call an API to save the settings
    // For this example, we'll just log it to the console
    console.log('New VITE_TUNE value:', newTuneString);
    alert('Settings applied successfully!');
  };

  return (
    <div class={styles.tuneTimings}>
      <h2>Prayer Time Adjustments</h2>
      <For each={tuneValues()}>
        {(value, index) => (
          <div class={styles.tuneInput}>
            <label class={styles.tuneLabel}>{prayerNames[index()]}: </label>
            <input
              class={styles.tuneInput}
              type="number"
              value={value}
              onInput={(e) => handleInputChange(index(), (e.target as HTMLInputElement).value)}
            />
          </div>
        )}
      </For>
      <div class={styles.tuneButtons}>
        <button onClick={applySettings}>Apply Settings</button>
      </div>
    </div>
  );
};

export default TuneTimings;