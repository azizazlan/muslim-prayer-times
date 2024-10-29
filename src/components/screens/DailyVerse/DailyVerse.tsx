import { createEffect, createResource, createSignal, createMemo, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import styles from './DailyVerse.module.scss';
import { useDailyVerseService } from '../../../context/useDailyVerseService';

const DailyVerse: Component = () => {
  const { verse, fetchNextRandVerse } = useDailyVerseService();
  const memoizedVerse = createMemo(() => verse());

  createEffect(() => {
    memoizedVerse();
  })

  if (!memoizedVerse()) {
    return (
      <div class={styles.container}>
        Daily Verse - Error. Please check internet connection.
      </div>
    )
  }
  return (
    <div class={styles.container}>
      <div class={styles.bismillahText}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
      <div class={styles.arabicText}>{memoizedVerse().text}</div>
      <div class={styles.enTranslationText}>{memoizedVerse().translation.text}</div>
      <div class={styles.verseInfo}>Surah No.{memoizedVerse().surah.number} {memoizedVerse().surah.name} {memoizedVerse().surah.englishName}, {memoizedVerse().surah.englishNameTranslation}, Verse {memoizedVerse().numberInSurah}.</div>
      <div class={styles.translatorInfo}>English translation by {memoizedVerse().edition.englishName}</div>
      <div>
        <button class={styles.btnFwd} onClick={() => fetchNextRandVerse()}>⏭</button>
      </div>
    </div>
  )
}
export default DailyVerse;
