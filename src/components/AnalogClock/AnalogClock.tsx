import { createSignal, onCleanup, onMount } from 'solid-js';
import { Hand } from './Hand';
import { Lines } from './Lines';
import { createAnimationLoop } from './utils';
import type { Component } from 'solid-js';
import './styles.scss'
import { useSettingsService } from '../../context/useSettingsService';

const getSecondsSinceMidnight = (): number => (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;


// const getSecondsSinceMidnight = (hour: number, minute: number, second: number): number => {
//   return hour * 3600 + minute * 60 + second; // Calculate total seconds from midnight
// };

type ClockFaceProps = {
  hour: string;
  minute: string;
  second: string;
  subsecond: string;
  latitude: string;
  mosqueName: string;
  locationName: string;
};

export const ClockFace: Component<ClockFaceProps> = (props) => (
  <svg viewBox="0 0 200 200" width="100vh">
    <g transform="translate(100, 100)">
      {/* static */}
      <circle class="text-neutral-900" r="99" fill="white" stroke="white" />
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
            fill="black"
          >
            {index === 0 ? 12 : index} {/* Display 12 for 0 */}
          </text>
        );
      })}


      {/* dynamic */}
      <Hand rotate={props.hour} class="hour" length={50} width={7} />
      <Hand rotate={props.minute} class="minute" length={89} width={5} />
      <Hand rotate={props.second} class="second" length={90} width={2} />

      <text x="" y="-35" text-anchor="middle" class="brand-text" font-size="7.5" font-weight="bold" fill="black">
        {props.mosqueName}
      </text>
      <text x="-1" y="41" text-anchor="middle" class="brand-text" font-size="6" font-weight="bold" fill="black">
        {props.locationName}
      </text>
      <text x="-1" y="48" text-anchor="middle" class="brand-text" font-size="6" font-weight="bold" fill="#f1c40f">
        LAT:{props.latitude} LONG:{import.meta.env.VITE_LONGITUDE}
      </text>
    </g>
  </svg>
);

export const AnalogClock: Component = () => {

  onMount(() => {
    // Add the event listener after the component has mounted
    document.addEventListener('fullscreenchange', () => {
      const clockElement = document.querySelector('.clock');
      if (clockElement) { // Check if the element exists
        if (document.fullscreenElement) {
          clockElement.classList.add('fullscreen');
        } else {
          clockElement.classList.remove('fullscreen');
        }
      }
    });
  });


  const { latitude, mosqueName, locationName } = useSettingsService();
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
      <ClockFace
        mosqueName={mosqueName}
        locationName={locationName}
        latitude={latitude}
        hour={hour()}
        minute={minute()}
        second={second()}
        subsecond={subsecond()} />
    </div>
  );
};
