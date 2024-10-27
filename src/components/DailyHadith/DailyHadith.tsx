import { Show, Component, createSignal, createEffect, onMount, createMemo } from 'solid-js';
import styles from './DailyHadith.module.scss';
import { useDailyHadithService } from '../../context/useDailyHadithService';

// Display daily hadith
const DailyHadith: Component = () => {

  const { hadith, selectNextHadith } = useDailyHadithService();

  return (
    <Show when={hadith()} fallback={<div>No hadith</div>} >
      <div class={styles.container}>
        <div class={styles.heading}>Hadith No {hadith().hadithNumber}: {hadith().headingEnglish}</div>
        <div class={styles.hadithBody}>
          {hadith().hadithEnglish}
        </div>
        <div class={styles.hadithMetadata}>Status: {hadith().status} Writer: {hadith().book.writerName}, Chapter: {hadith().chapter.chapterEnglish}, Book: {hadith().book.bookName} Vol: {hadith().volume}</div>
        <div><button onClick={selectNextHadith}>NEXT</button></div>
      </div>
    </Show>
  );
};

export default DailyHadith;