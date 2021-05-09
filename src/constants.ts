import { Preset } from './types';

export const presetProperties: (keyof Preset)[] = [
  'hourCycle',
  'dateStyle',
  'timeStyle',
  'dayPeriod',
  'weekday',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName',
  'timeZone',
  'hour12',
];

export const defaultPresetsYaml = `
shortDate:
  month: short
  day: numeric
  year: numeric
shortDateTime:
  dateStyle: medium
  timeStyle: short
shortDateWithoutYear:
  month: short
  day: numeric
utcShortDate:
  month: short
  day: numeric
  year: numeric
  timeZone: utc
shortYearMonth:
  month: short
  year: numeric
utcShortDateTime:
  dateStyle: long
  timeStyle: short
  timeZone: utc
23htime:
  hour: numeric
  minute: numeric
  hourCycle: h23
`.trim();
