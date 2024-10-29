import { Show, Component, createSignal, createEffect, onMount, createMemo } from 'solid-js';
import styles from './DailyDua.module.scss';
import { useDuaService } from '../../../contexts/useDuaService';

const DailyDua: Component = () => {
  const { selectedDua, nextDua } = useDuaService();
  return (
    <Show when={selectedDua()} fallback={<div class={styles.container}>No Dua found!</div>}>
      <div class={styles.container}>
        <div class={styles.surahHeading}>Dua from Qur'an: {selectedDua().surahEnglish} {selectedDua().surahArabic} ({selectedDua().verseNo})</div>
        <div class={styles.duaArabic}>
          {selectedDua().duaArabic}
        </div>
        <div class={styles.duaEnglish}>
          {selectedDua().duaEnglish}
        </div>
        <div>
          <button onClick={nextDua}>Next</button>
        </div>
      </div>
    </Show>
  )
}

export default DailyDua;