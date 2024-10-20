import { createEffect, createResource, createSignal, createMemo, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import styles from './DailyVerse.module.scss';
import { useDailyVerseService } from '../../context/useDailyVerseService';

const DailyVerse: Component = () => {
  const { verse } = useDailyVerseService();
  if (!verse()) {
    return (
      <div class={styles.container}>
        Error. Please check internet connection.
      </div>
    )
  }
  const { text, numberInSurah, surah, translation, edition } = verse();
  return (
    <div class={styles.container}>
      <div class={styles.bismillahText}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
      <div class={styles.arabicText}>{text}</div>
      <div class={styles.enTranslationText}>{translation.text}</div>
      <div class={styles.verseInfo}>Verse {numberInSurah}, Surah {surah.number} {surah.name} -  {surah.englishName}  {surah.englishNameTranslation}</div>
      <div class={styles.translatorInfo}>English translation by {edition.englishName}</div>
    </div>
  )
}
export default DailyVerse;
