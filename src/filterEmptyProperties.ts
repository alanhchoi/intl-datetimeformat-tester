import { DateTimeFormatOptions } from './types';

const filterEmptyProperties = (
  obj: DateTimeFormatOptions
): DateTimeFormatOptions => {
  return Object.entries(obj)
    .filter((entry): entry is [keyof DateTimeFormatOptions, any] => {
      const [, value] = entry;
      return typeof value === 'boolean' || !!value;
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as DateTimeFormatOptions);
};

export default filterEmptyProperties;
