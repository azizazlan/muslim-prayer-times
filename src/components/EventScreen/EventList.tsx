// EventList.tsx
import { Show, For, createEffect, createMemo } from "solid-js";
import { parse, format } from 'date-fns';
import styles from './EventList.module.scss'
import MosqueEvent from "../../types/mosqueEvent";
import { useEventsService } from "../../context/useEventsService";

const EventList = () => {
  const { events, removeEvent } = useEventsService();

  return (
    <div class={styles.container}>
      <Show when={events().length === 0}>
        <div> -No event- </div>
      </Show>
      <Show when={events().length > 0}>
        <For each={events()}>
          {(event) => {
            return (
              <li class={styles.eventBullet}>
                <div class={styles.eventContainer}>
                  <div class={styles.eventText}>⦿ {event.eventText}</div>
                  <div class={styles.dateContainer}>
                    <div class={styles.date}>{format(new Date(event.date), "EEE dd MMM yyyy")}</div>
                    {event.repeat && (
                      <div class={styles.repeatsContainer}>
                        🔄 {event.repeatDays.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                <button class={styles.btn} onClick={() => removeEvent(event)}>Remove</button>
              </li>
            )
          }}
        </For>
      </Show>
    </div>
  );
};

export default EventList;
