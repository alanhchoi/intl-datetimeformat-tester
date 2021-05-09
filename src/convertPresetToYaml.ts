import YAML from 'yaml';
import filterEmptyProperties from './filterEmptyProperties';
import { Preset } from './types';

const convertPresetToYaml = (preset: Preset) =>
  YAML.stringify(filterEmptyProperties(preset), { sortMapEntries: true });

export default convertPresetToYaml;
