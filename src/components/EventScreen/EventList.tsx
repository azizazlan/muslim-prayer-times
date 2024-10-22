// EventList.tsx
import { Show, For, createEffect, createMemo } from "solid-js";
import { parse, format } from 'date-fns';
import styles from './EventList.module.scss'

interface Event {
  id: number;
  eventText: string;
  date: string;
  repeat: boolean;
  repeatDays: string[];
}

interface EventListProps {
  events: Event[];
  removeEvent: (eventItem: Event) => void;
}

const EventList = (props: EventListProps) => {

  return (
    <div class={styles.container}>
      <Show when={props.events.length === 0}>
        <div> -No event- </div>
      </Show>
      <Show when={props.events.length > 0}>
        <For each={props.events}>
          {(event) => {
            return (
              <li class={styles.eventBullet}>
                <div class={styles.eventInfoContainer}>
                  <div class={styles.eventInfoTexts}>
                    <div class={styles.eventText}>{event.eventText}</div>
                  </div>
                  <button class={styles.btn} onClick={() => props.removeEvent(event)}>Remove</button>
                </div>
                <div class={styles.dateContainer}>
                  <div class={styles.date}>{format(new Date(event.date), "EEE dd-MMM-yyyy")}</div>
                  {event.repeat && (
                    <div>
                      Repeats on: {event.repeatDays.join(", ")}
                    </div>
                  )}
                </div>
              </li>
            )
          }}
        </For>
      </Show>
    </div>
  );
};

export default EventList;
