// EventList.tsx
import { Show, For, createEffect, createMemo } from "solid-js";
import { parse, format } from 'date-fns';
import styles from './NoticeList.module.scss'
import { useNoticeService } from "../../../context/useNoticeService";

const NoticeList = () => {
  const { notices, removeNotice } = useNoticeService();

  return (
    <div class={styles.container}>
      <Show when={notices().length === 0}>
        <div> -No notice- </div>
      </Show>
      <Show when={notices().length > 0}>
        <For each={notices()}>
          {(notice) => {
            return (
              <li class={styles.noticeBullet}>
                <div class={styles.noticeContainer}>
                  <div class={styles.noticeText}>⦿ {notice.noticeText}</div>
                  <div class={styles.dateContainer}>
                    <div class={styles.date}>{format(new Date(notice.date), "EEE dd MMM yyyy")}</div>
                    {notice.repeat && (
                      <div class={styles.repeatsContainer}>
                        🔄 {notice.repeatDays.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                <button class={styles.btn} onClick={() => removeNotice(notice)}>Remove</button>
              </li>
            )
          }}
        </For>
      </Show>
    </div>
  );
};

export default NoticeList;
