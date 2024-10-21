// EventList.tsx
import { For } from "solid-js";
import { parse, format } from 'date-fns';
import styles from './EventList.module.scss'

interface Event {
  id: number;
  title: string;
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
      <For each={props.events}>
        {(event) => {
          console.log(event.date)
          return (
            <li class={styles.eventBullet}>
              <div class={styles.eventInfoContainer}>
                <div class={styles.eventInfoTexts}>
                  <div class={styles.eventTitle}>{event.title}</div>
                  <div class={styles.eventText}>{event.eventText}</div>
                </div>
                <button onClick={() => props.removeEvent(event)}>Remove</button>
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
    </div>
  );
};

export default EventList;
