import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import { DisplayMode } from '../../types/displaymode';
import styles from './Sleep.module.scss';
import { AnalogClock } from '../AnalogClock/AnalogClock';

interface SleepProps {

}

const Sleep = (props: SleepProps) => {
  return (
    <div class={styles.container}>
      <AnalogClock />
      <div class={styles.message}>Dapatkan rehat yang mencukupi</div>
    </div>
  );
};

export default Sleep;
