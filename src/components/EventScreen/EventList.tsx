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
}

const EventList = (props: EventListProps) => {
  return (
    <div class={styles.container}>
      <ul>
        <For each={props.events}>
          {(event) => {
            console.log(event.date)
            return (
              <li class={styles.eventBullet}>
                <div class={styles.eventInfoContainer}><div class={styles.eventTitle}>{event.title}</div><div class={styles.eventText}>{event.eventText}</div> </div>
                <div>{format(new Date(event.date), "EEE dd-MMM-yyyy")}</div>
                {event.repeat && (
                  <div>
                    Repeats on: {event.repeatDays.join(", ")}
                  </div>
                )}
              </li>
            )
          }}
        </For>
      </ul>
    </div>
  );
};

export default EventList;
