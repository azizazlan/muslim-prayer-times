import { Component, createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { format } from 'date-fns';
import { ms } from 'date-fns/locale';
import styles from './EventScreen.module.scss';
import { useEventsService } from '../../context/useEventsService';

const EventScreen: Component = () => {

  const { displayEvent } = useEventsService();

  return (
    <div class={styles.container}>
      <Show when={!displayEvent()}>
        <div class={styles.dateContainer}>Isnin, 11 Jan 2055</div>
        <div class={styles.borderBottom}></div>
        <div class={styles.announcementText}>
          Semua Jemaah Qariah dijemput Hadir ke Kuliah Maghrib.
        </div>
      </Show>
      <Show when={displayEvent()}>
        <div class={styles.dateContainer}>{format(displayEvent().date, 'EEEE dd MMM yyyy', { locale: ms })}</div>
        <div class={styles.borderBottom}></div>
        <div class={styles.announcementText}>
          {displayEvent().eventText}
        </div>
      </Show>
    </div>
  );
};

export default EventScreen;
