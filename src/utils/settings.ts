import { createSignal, createEffect } from 'solid-js';

// Define the structure of your settings
interface Settings {
  tune: number[];
}

// Initialize with default values from env
const defaultSettings: Settings = {
  tune: import.meta.env.VITE_TUNE ? import.meta.env.VITE_TUNE.split(',').map(Number) : [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// Create a signal for the settings
const [settings, setSettings] = createSignal<Settings>(
  JSON.parse(localStorage.getItem('userSettings') || JSON.stringify(defaultSettings))
);

// Save settings to localStorage whenever they change
createEffect(() => {
  localStorage.setItem('userSettings', JSON.stringify(settings()));
});

// Function to update settings
export const updateSettings = (newSettings: Partial<Settings>) => {
  setSettings(prev => ({ ...prev, ...newSettings }));
};

export { settings };