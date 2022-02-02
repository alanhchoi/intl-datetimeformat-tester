import { DateTimeFormatOptions } from './types';

const filterEmptyProperties = (obj: DateTimeFormatOptions) => {
  return Object.entries(obj)
    .filter(([, value]) => {
      return typeof value === 'boolean' || !!value;
    })
    .reduce<any>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

export default filterEmptyProperties;
