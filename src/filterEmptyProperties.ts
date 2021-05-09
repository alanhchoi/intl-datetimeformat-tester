import { Preset } from './types';

const filterEmptyProperties = (preset: Preset) => {
  return Object.entries(preset)
    .filter(([key, value]) => {
      return typeof value === 'boolean' || !!value;
    })
    .reduce<any>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

export default filterEmptyProperties;
