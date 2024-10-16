import { createSignal, onCleanup } from 'solid-js';
import { Hand } from './Hand';
import { Lines } from './Lines';
import { createAnimationLoop } from './utils';
import type { Component } from 'solid-js';
import './styles.css'

const getSecondsSinceMidnight = (): number => (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;

type ClockFaceProps = {
  hour: string;
  minute: string;
  second: string;
  subsecond: string;
};

export const ClockFace: Component<ClockFaceProps> = (props) => (
  <svg viewBox="0 0 200 200" width="95vh">
    <g transform="translate(100, 100)">
      {/* static */}
      <circle class="text-neutral-900" r="99" fill="white" stroke="currentColor" />
      <Lines numberOfLines={60} class="subsecond" length={2} width={1} />
      <Lines numberOfLines={12} class="hour" length={5} width={2} />
      {/* dynamic */}
      <Hand rotate={props.hour} class="hour" length={50} width={4} />
      <Hand rotate={props.minute} class="minute" length={70} width={3} />
      <Hand rotate={props.second} class="second" length={80} width={2} />

      <image
        class="clock-logo"
        href="/src/assets/images/clock-logo.png" // Replace with the path to your PNG image
        x="-45"
        y="-60" // Position below the seconds hand
        width="90" // Set the width of the image
        height="50" // Set the height of the image
        zIndex="-100"
      />
      <text x="-1" y="48" text-anchor="middle" class="brand-text" font-size="6" font-weight="bold" fill="#003366">
        KOTA DAMANSARA
      </text>
      <text x="-1" y="55" text-anchor="middle" class="brand-text" font-size="5" font-weight="bold" fill="#003366">
        SELANGOR
      </text>
    </g>
  </svg>
);

export const AnalogClock: Component = () => {
  const [time, setTime] = createSignal<number>(getSecondsSinceMidnight());
  const dispose = createAnimationLoop(() => {
    setTime(getSecondsSinceMidnight());
  });
  onCleanup(dispose);

  const rotate = (rotate: number, fixed: number = 1) => `rotate(${(rotate * 360).toFixed(fixed)})`;

  const subsecond = () => rotate(time() % 1);
  const second = () => rotate((time() % 60) / 60);
  const minute = () => rotate(((time() / 60) % 60) / 60);
  const hour = () => rotate(((time() / 60 / 60) % 12) / 12);

  return (
    <div class="clock">
      <ClockFace hour={hour()} minute={minute()} second={second()} subsecond={subsecond()} />
    </div>
  );
};
