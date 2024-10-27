import { Component, createSignal, createEffect, onMount } from 'solid-js';
import styles from './DailyHadith.module.scss';

// Display daily hadith
const DailyHadith: Component = () => {

  return (
    <div class={styles.container}>
      <h3>Dailly Hadith</h3>
    </div>
  );
};

export default DailyHadith;