import { createSignal, onCleanup } from 'solid-js';
import { Hand } from './Hand';
import { Lines } from './Lines';
import { createAnimationLoop } from './utils';
import type { Component } from 'solid-js';
import './styles.css'

const getSecondsSinceMidnight = (): number => (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;


// const getSecondsSinceMidnight = (hour: number, minute: number, second: number): number => {
//   return hour * 3600 + minute * 60 + second; // Calculate total seconds from midnight
// };

type ClockFaceProps = {
  hour: string;
  minute: string;
  second: string;
  subsecond: string;
};

export const ClockFace: Component<ClockFaceProps> = (props) => (
  <svg viewBox="0 0 200 200" width="70vh">
    <g transform="translate(100, 100)">
      {/* static */}
      <circle class="text-neutral-900" r="99" fill="white" stroke="currentColor" />
      <Lines numberOfLines={60} class="subsecond" length={2} width={1} />
      <Lines numberOfLines={12} class="hour" length={5} width={2} />

      {[...Array(12)].map((_, index) => {
        const angle = (index * 30) - 90; // Calculate angle for each hour
        const x = 80 * Math.cos((angle * Math.PI) / 180); // X position
        const y = 80 * Math.sin((angle * Math.PI) / 180); // Y position
        return (
          <text
            key={index}
            x={x}
            y={y + 5} // Adjust the y position slightly downwards
            text-anchor="middle"
            class="hour-label"
            font-size="17"
            font-weight="bold"
            fill="#003366"
          >
            {index === 0 ? 12 : index} {/* Display 12 for 0 */}
          </text>
        );
      })}


      {/* dynamic */}
      <Hand rotate={props.hour} class="hour" length={50} width={4} />
      <Hand rotate={props.minute} class="minute" length={70} width={3} />
      <Hand rotate={props.second} class="second" length={80} width={2} />

      {/* <image
        class="clock-logo"
        href="/src/assets/images/clock-logo.png" // Replace with the path to your PNG image
        x="-45"
        y="-60" // Position below the seconds hand
        width="90" // Set the width of the image
        height="50" // Set the height of the image
        zIndex="-100"
      /> */}
      <text x="" y="-35" text-anchor="middle" class="brand-text" font-size="7" font-weight="bold" fill="#003366">
        SURAU DE ROZELLE
      </text>
      <text x="-1" y="48" text-anchor="middle" class="brand-text" font-size="6" font-weight="bold" fill="#003366">
        KOTA DAMANSARA
      </text>
      <text x="-1" y="55" text-anchor="middle" class="brand-text" font-size="5" font-weight="bold" fill="#003366">
        PJ, SELANGOR
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
  const hour = () => rotate(((time() / 3600) % 12) / 12); // Adjusted to use total seconds

  return (
    <div class="clock">
      <ClockFace hour={hour()} minute={minute()} second={second()} subsecond={subsecond()} />
    </div>
  );
};
