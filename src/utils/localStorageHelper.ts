// Utility functions to handle localStorage
const loadFromLocalStorage = function <T>(key: string, defaultValue: T): T {
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) {
    return defaultValue;  // Use default value if nothing is stored
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return defaultValue;  // Return default on JSON parse error
  }
};

const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key "${key}":`, e);
  }
};

export { loadFromLocalStorage, saveToLocalStorage }

