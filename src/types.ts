import { Hour12Options } from './App/constants';

export type DateTimeFormatOptions = {
  hourCycle: string;
  dateStyle: string;
  timeStyle: string;
  dayPeriod: string;
  weekday: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  timeZoneName: string;
  timeZone: string;
  hour12: Hour12Options;
};
