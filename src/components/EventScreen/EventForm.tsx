import { createSignal } from "solid-js";
import { Component } from 'solid-js/types'
import { format } from 'date-fns';
import styles from './EventForm.module.scss';

interface Event {
  id: number;
  date: string;
  repeat: boolean;
  repeatDays: string[];
}

interface EventFormProps {
  addEvent: (event: Event) => void;
}

const EventForm: Component = (props: EventFormProps) => {

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
      eventText: eventText(),
      date: date(),
      repeat: repeat(),
      repeatDays: repeatDays(),
    };
    props.addEvent(newEvent);
    setEventText("");
    setDate("");
    setRepeat(false);
    setRepeatDays([]);
  };

  const handleDefaultValues = (day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri") => {
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

    // Day mappings to index (0 = Sunday, 1 = Monday, etc.)
    const dayMapping = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
    };

    // Get today's date
    const today = new Date();

    // Get the first day of the next month (e.g., if today is Oct 21, this will be Nov 1)
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Get the numeric value for the day passed in (Mon = 1, Tue = 2, etc.)
    const targetDay = dayMapping[day];

    // Get the day of the week for the first day of the next month
    const firstDayOfNextMonthDay = firstDayOfNextMonth.getDay(); // (0 = Sunday, 1 = Monday, etc.)

    // Calculate how many days to add to reach the first occurrence of the target day
    const daysUntilTarget = (targetDay >= firstDayOfNextMonthDay)
      ? targetDay - firstDayOfNextMonthDay
      : 7 - (firstDayOfNextMonthDay - targetDay);

    // Add the calculated number of days to the first day of the next month to get the correct date
    const firstOccurrenceOfTargetDay = new Date(firstDayOfNextMonth);
    firstOccurrenceOfTargetDay.setDate(firstOccurrenceOfTargetDay.getDate() + daysUntilTarget);

    // Format the date as 'YYYY-MM-DD'
    const formattedDate = format(firstOccurrenceOfTargetDay, 'yyyy-MM-dd');

    // Set the calculated date
    setDate(formattedDate);

    setDate(formattedDate);
    setRepeat(true);
    setRepeatDays([...repeatDays(), day]);
  }

  return (
    <div class={styles.container}>
      <form class={styles.form} onSubmit={handleSubmit}>

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
        <br />
        <div class={styles.formButtons}>
          <div class={styles.labelExamples}>Examples:</div>
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