type DateTimeFormatOption<T extends keyof Intl.DateTimeFormatOptions> =
  NonNullable<Intl.DateTimeFormatOptions[T]>;

type HourCycle = DateTimeFormatOption<'hourCycle'>;
type DateStyle = DateTimeFormatOption<'dateStyle'>;
type TimeStyle = DateTimeFormatOption<'timeStyle'>;
type DayPeriod = DateTimeFormatOption<'dayPeriod'>;
type Weekday = DateTimeFormatOption<'weekday'>;
type Year = DateTimeFormatOption<'year'>;
type Month = DateTimeFormatOption<'month'>;
type Day = DateTimeFormatOption<'day'>;
type Hour = DateTimeFormatOption<'hour'>;
type Minute = DateTimeFormatOption<'minute'>;
type Second = DateTimeFormatOption<'second'>;
type TimeZoneName = DateTimeFormatOption<'timeZoneName'>;

export enum Hour12Options {
  True = 'true',
  False = 'false',
}

export const hourCycles: HourCycle[] = ['h11', 'h12', 'h23', 'h24'];
export const dateStyles: DateStyle[] = ['full', 'long', 'medium', 'short'];
export const timeStyles: TimeStyle[] = ['full', 'long', 'medium', 'short'];
export const dayPeriods: DayPeriod[] = ['long', 'short', 'narrow'];
export const weekdays: Weekday[] = ['long', 'short', 'narrow'];
export const years: Year[] = ['numeric', '2-digit'];
export const months: Month[] = [
  'numeric',
  '2-digit',
  'long',
  'short',
  'narrow',
];
export const days: Day[] = ['numeric', '2-digit'];
export const hours: Hour[] = ['numeric', '2-digit'];
export const minutes: Minute[] = ['numeric', '2-digit'];
export const seconds: Second[] = ['numeric', '2-digit'];
export const timeZoneNames: TimeZoneName[] = ['long', 'short'];
