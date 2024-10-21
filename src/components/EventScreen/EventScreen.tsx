import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import styles from './EventScreen.module.scss';

const EventScreen: Component = () => {

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        Kuliah Maghrib
      </div>
      <div class={styles.announcementText}>
        Ustaz Wan. Idaman Penuntut.
      </div>
    </div>
  );
};

export default EventScreen;
