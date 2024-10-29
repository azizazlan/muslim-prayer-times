import { createSignal } from "solid-js";
import { Component } from 'solid-js/types'
import { format } from 'date-fns';
import styles from './NoticeForm.module.scss';
import { NoticeProp } from '../../../types';
import { useNoticeService } from "../../../context/useNoticeService";


const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NoticeForm: Component = () => {
  const { addNotice } = useNoticeService();

  const [noticeText, setNoticeText] = createSignal("Ustaz Wan. Idaman Penuntut");
  const [date, setDate] = createSignal("");
  const [repeat, setRepeat] = createSignal(false);
  const [repeatDays, setRepeatDays] = createSignal<string[]>([]);

  const handleRepeatDaysChange = (day: string) => {
    if (repeatDays().includes(day)) {
      setRepeatDays(repeatDays().filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays(), day]);
    }
  };

  const handleSubmit = (e: NoticeProp) => {
    e.preventDefault();
    const newNotice: NoticeProp = {
      id: Math.random(),
      noticeText: noticeText(),
      date: date(),
      repeat: repeat(),
      repeatDays: repeatDays(),
    };
    addNotice(newNotice);
    setNoticeext("");
    setDate("");
    setRepeat(false);
    setRepeatDays([]);
  };

  return (
    <div class={styles.container}>
      <form class={styles.form} onSubmit={handleSubmit}>

        <div class={styles.formField}>
          <label class={styles.formLabel}>Title</label>
          <textarea
            rows={5}
            class={styles.formInput}
            value={noticeText()} // Bind the value to the signal
            onInput={(e) => setNoticeText(e.currentTarget.value)} // Update the signal on input change
            required
          />
        </div>

        <div class={styles.formField}>
          <label class={styles.formLabel}>Date</label>
          <input
            class={styles.formInput}
            type="date"
            value={date()}
            onInput={(e) => setDate(e.currentTarget.value)}
            required
          />
        </div>

        <div class={styles.repeatsContainer}>
          <label class={styles.formCheckboxLabel}>
            <input
              hidden
              type="checkbox"
              checked={repeat()}
              onChange={(e) => setRepeat(e.currentTarget.checked)}
            />
            🔄
          </label>

          {repeat() && (
            <>
              {daysOfWeek.map((day) => (
                <label class={styles.formCheckboxLabel}>
                  <input
                    class={styles.formCheckboxInput}
                    type="checkbox"
                    value={day}
                    checked={repeatDays().includes(day)}
                    onChange={() => handleRepeatDaysChange(day)}
                  />
                  {day}
                </label>
              ))}
            </>
          )}
        </div>
        <div class={styles.formButtons}>
          <button class={styles.submitBtn} type="submit">Add notice</button>
        </div>
      </form>
    </div>
  )
}

export default NoticeForm;