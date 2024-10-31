import { Component, createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { format } from 'date-fns';
import { ms } from 'date-fns/locale';
import styles from './Notice.module.scss';
import { useNoticeService } from '../../../contexts/useNoticeService';

const Notice: Component = () => {

  const { selectedNotice } = useNoticeService();

  return (
    <div class={styles.container}>
      <Show when={!selectedNotice()}>
        <div class={styles.dateContainer}>Isnin, 11 Jan 2055</div>
        <div class={styles.borderBottom}></div>
        <div class={styles.announcementText}>
          Semua Jemaah Qariah dijemput Hadir ke Kuliah Maghrib.
        </div>
      </Show>
      <Show when={selectedNotice()}>
        <div class={styles.dateContainer}>{format(selectedNotice().date, 'EEEE dd MMM yyyy', { locale: ms })}</div>
        <div class={styles.borderBottom}></div>
        <div class={styles.announcementText}>
          {selectedNotice().noticeText}
        </div>
      </Show>
    </div>
  );
};

export default Notice;
