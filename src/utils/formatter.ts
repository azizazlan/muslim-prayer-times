import { format, addMinutes, subMinutes, isValid } from 'date-fns';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).replace(/\s(AM|PM)/, (match) => match.toUpperCase());
};
export { formatTime };

const formatPrayerTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/\s(AM|PM)/, (match) => match.toUpperCase()).replace(/\s/g, '');
};
export { formatPrayerTime };

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
export { formatCountdown };

const getFormattedDate = (date: Date) => {
  if (isValid(date)) {
    return format(date, 'dd/MM/yyyy').toUpperCase();
  }
  return 'Invalid Date';
};
export { getFormattedDate };

const getPrettyFormattedDate = (date: Date) => {
  if (isValid(date)) {
    return format(date, 'EEE dd MMM yyyy');
  }
  return 'Invalid Date';
};
export { getPrettyFormattedDate };