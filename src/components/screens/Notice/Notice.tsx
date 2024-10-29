import { Component, createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { format } from 'date-fns';
import { ms } from 'date-fns/locale';
import styles from './Notice.module.scss';
import { useNoticeService } from '../../../context/useNoticeService';

const Notice: Component = () => {

  const { displayNotice } = useNoticeService();

  return (
    <div class={styles.container}>
      <Show when={!displayNotice()}>
        <div class={styles.dateContainer}>Isnin, 11 Jan 2055</div>
        <div class={styles.borderBottom}></div>
        <div class={styles.announcementText}>
          Semua Jemaah Qariah dijemput Hadir ke Kuliah Maghrib.
        </div>
      </Show>
      <Show when={displayNotice()}>
        <div class={styles.dateContainer}>{format(displayNotice().date, 'EEEE dd MMM yyyy', { locale: ms })}</div>
        <div class={styles.borderBottom}></div>
        <div class={styles.announcementText}>
          {displayNotice().noticeText}
        </div>
      </Show>
    </div>
  );
};

export default Notice;
