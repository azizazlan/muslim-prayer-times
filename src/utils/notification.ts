import ding from '../assets/audio/din-ding-89718.mp3';
import azanMecca from '../assets/audio/mecca_56_22.mp3';

let audio: HTMLAudioElement | null = null;

export const playSound = () => {
  // Initialize the audio if not already playing
  if (!audio) {
    audio = new Audio(azanMecca);
  }
  audio.play();
};

export const stopSound = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0; // Reset to the beginning
    audio = null; // Clear the reference so it can be re-initialized
  }
};