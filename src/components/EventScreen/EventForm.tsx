import { createSignal } from "solid-js";
import { Component } from 'solid-js/types'
import { format } from 'date-fns';
import styles from './EventForm.module.scss';

interface Event {
  id: number;
  title: string;
  date: string;
  repeat: boolean;
  repeatDays: string[];
}

interface EventFormProps {
  addEvent: (event: Event) => void;
}

const EventForm: Component = (props: EventFormProps) => {

  const [title, setTitle] = createSignal("Kuliah Maghrib");
  const [eventText, setEventText] = createSignal("Ustaz Wan. Idaman Penuntut");
  const [date, setDate] = createSignal("");
  const [repeat, setRepeat] = createSignal(false);
  const [repeatDays, setRepeatDays] = createSignal<string[]>([]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleRepeatDaysChange = (day: string) => {
    if (repeatDays().includes(day)) {
      setRepeatDays(repeatDays().filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays(), day]);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Math.random(),
      title: title(),
      eventText: eventText(),
      date: date(),
      repeat: repeat(),
      repeatDays: repeatDays(),
    };
    props.addEvent(newEvent);
    setTitle("");
    setEventText("");
    setDate("");
    setRepeat(false);
    setRepeatDays([]);
  };

  const handleDefaultValues = (day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri") => {
    setTitle("Kuliah Maghrib");
    switch (day) {
      case "Mon":
        setEventText("Ustaz Nadzmi. Aqidah Muslimin");
        break;
      case "Tue":
        setEventText("Ustaz Azmi Sabdin. Tadabur");
        break;
      case "Wed":
        setEventText("Ustaz Hazwan. Kelebihan Amal Ibadah");
        break;
      case "Thu":
        setEventText("Ustaz Talhah. Sifat 20");
        break;
      case "Fri":
        setEventText("Ustaz Shakir. Feqah Ibadah");
        break;
      default:
        setEventText("Ustaz Nadzmi. Aqidah Muslimin"); // Default to Monday
    }

    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');

    setDate(formattedDate);
    setRepeat(false);
    setRepeatDays([]);
  }

  return (
    <div class={styles.container}>
      <form class={styles.form} onSubmit={handleSubmit}>
        <div class={styles.formField}>
          <label class={styles.formLabel}>Title</label>
          <input
            class={styles.formInput}
            type="text"
            defaultValue="Kuliah Maghrib"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            required
          />
        </div>

        <div class={styles.formField}>
          <label class={styles.formLabel}>Event</label>
          <textarea
            rows={3}
            class={styles.formInput}
            value={eventText()} // Bind the value to the signal
            onInput={(e) => setEventText(e.currentTarget.value)} // Update the signal on input change
            required
          />
        </div>

        <div class={styles.formField}>
          <label class={styles.formLabel}>Date:</label>
          <input
            class={styles.formInput}
            type="date"
            value={date()}
            onInput={(e) => setDate(e.currentTarget.value)}
            required
          />
        </div>

        <div class={styles.formField}>
          <label class={styles.formCheckboxLabel}>
            <input
              type="checkbox"
              checked={repeat()}
              onChange={(e) => setRepeat(e.currentTarget.checked)}
            />
            Repeat Event?
          </label>
        </div>

        {repeat() && (
          <div class={styles.formField}>
            <label>Repeat on:</label>
            {daysOfWeek.map((day) => (
              <label class={styles.formLabel}>
                <input
                  type="checkbox"
                  value={day}
                  checked={repeatDays().includes(day)}
                  onChange={() => handleRepeatDaysChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        )}
        <div class={styles.formButtons}>
          <button class={styles.submitBtn} type="button" onClick={() => handleDefaultValues("Mon")}>Mon</button>
          <button class={styles.submitBtn} type="button" onClick={() => handleDefaultValues("Tue")}>Tue</button>
          <button class={styles.submitBtn} type="button" onClick={() => handleDefaultValues("Wed")}>Wed</button>
          <button class={styles.submitBtn} type="button" onClick={() => handleDefaultValues("Thu")}>Thu</button>
          <button class={styles.submitBtn} type="button" onClick={() => handleDefaultValues("Fri")}>Fri</button>
        </div>
        <div class={styles.formButtons}>
          {/* <button class={styles.submitBtn} type="button" onClick={handleDefaultValues}>Default values</button> */}
          <button class={styles.submitBtn} type="submit">Add Event</button>
        </div>
      </form>
    </div>
  )
}

export default EventForm;