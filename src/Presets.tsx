import {
  ComponentProps,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import 'twin.macro';
import YAML from 'yaml';
import AddPresetDialog from './AddPresetDialog';
import Button from './components/Button';
import Card from './components/Card';
import Divider from './components/Divider';
import Select from './components/Select';
import { defaultPresetsYaml } from './constants';
import EditPresetDialog from './EditPresetDialog';
import ManagePresetsDialog from './ManagePresetsDialog';
import { Preset } from './types';

type Props = {
  getValues: () => Preset;
  selectedPresetName?: string;
  onSelect: (name: string, preset: Preset) => void;
  isEdited: boolean;
};

const useDialog = (options?: { resetStateOnClose?: boolean }) => {
  const { resetStateOnClose = true } = options || {};
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    show: useCallback(() => {
      setIsOpen(true);
    }, []),
    close: useCallback(() => {
      setIsOpen(false);
    }, []),
    render: useCallback(
      (dialogElement: ReactNode) => {
        if (resetStateOnClose && !isOpen) {
          return null;
        }
        return dialogElement;
      },
      [isOpen, resetStateOnClose]
    ),
  };
};

const useAddPresetDialog = ({
  getCurrentPreset,
  existingPresets,
}: {
  getCurrentPreset: () => Preset;
  existingPresets: Record<string, Preset>;
}) => {
  const [currentFormatOptions, setCurrentFormatOptions] = useState(() => {
    return getCurrentPreset();
  });
  const { isOpen, show: showDialog, close, render } = useDialog();

  const existingPresetNames = useMemo(() => Object.keys(existingPresets), [
    existingPresets,
  ]);

  const show = () => {
    setCurrentFormatOptions(getCurrentPreset());
    showDialog();
  };

  return {
    show,
    isOpen,
    renderDialog: ({
      onSubmit,
    }: {
      onSubmit: ComponentProps<typeof AddPresetDialog>['onSubmit'];
    }) =>
      render(
        <AddPresetDialog
          existingPresetNames={existingPresetNames}
          preset={currentFormatOptions}
          isOpen={isOpen}
          close={close}
          onSubmit={onSubmit}
        />
      ),
  };
};

const useEditPresetDialog = ({
  preset,
  getCurrentPreset,
  presetName,
}: {
  presetName?: string;
  preset?: Preset;
  getCurrentPreset: () => Preset;
}) => {
  const [currentFormatOptions, setCurrentFormatOptions] = useState(() => {
    return getCurrentPreset();
  });
  const { isOpen, show: showDialog, close, render } = useDialog();

  const show = () => {
    setCurrentFormatOptions(getCurrentPreset());
    showDialog();
  };

  return {
    show,
    isOpen,
    renderDialog: ({
      onSave,
    }: Pick<ComponentProps<typeof EditPresetDialog>, 'onSave'>) => {
      if (!presetName || !preset) {
        return null;
      }

      return render(
        <EditPresetDialog
          isOpen={isOpen}
          presetName={presetName}
          close={close}
          preset={preset}
          currentFormatOptions={currentFormatOptions}
          onSave={onSave}
        />
      );
    },
  };
};

const useManagePresetsDialog = ({
  existingPresets,
}: {
  existingPresets: Record<string, Preset>;
}) => {
  const { isOpen, show: showDialog, close, render } = useDialog();

  const show = () => {
    showDialog();
  };

  return {
    show,
    isOpen,
    renderDialog: ({
      onSave,
    }: Pick<ComponentProps<typeof ManagePresetsDialog>, 'onSave'>) =>
      render(
        <ManagePresetsDialog
          isOpen={isOpen}
          currentPresets={existingPresets}
          close={close}
          onSave={onSave}
        />
      ),
  };
};

const Presets: FC<Props> = ({
  getValues,
  onSelect,
  isEdited,
  selectedPresetName,
}) => {
  const [presets, setPresets] = useState<Record<string, Preset>>(() => {
    try {
      const presetsInLocalStorage = window.localStorage.getItem('presets');

      if (presetsInLocalStorage) {
        return JSON.parse(presetsInLocalStorage);
      }
      return YAML.parse(defaultPresetsYaml);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem('presets', JSON.stringify(presets));
  }, [presets]);

  const getCurrentPreset = useCallback((): Preset => {
    const {
      hourCycle,
      dateStyle,
      timeStyle,
      dayPeriod,
      weekday,
      year,
      month,
      day,
      hour,
      minute,
      second,
      timeZoneName,
      timeZone,
      hour12,
    } = getValues();

    return {
      hourCycle,
      dateStyle,
      timeStyle,
      dayPeriod,
      weekday,
      year,
      month,
      day,
      hour,
      minute,
      second,
      timeZoneName,
      timeZone,
      hour12,
    };
  }, [getValues]);

  const {
    show: showAddPresetDialog,
    renderDialog: renderAddPresetDialog,
  } = useAddPresetDialog({ getCurrentPreset, existingPresets: presets });

  const {
    show: showEditPresetDialog,
    renderDialog: renderEditPresetDialog,
  } = useEditPresetDialog({
    getCurrentPreset,
    presetName: selectedPresetName,
    preset: selectedPresetName ? presets[selectedPresetName] : undefined,
  });

  const {
    show: showManagePresetsDialog,
    renderDialog: renderManagePresetsDialog,
  } = useManagePresetsDialog({ existingPresets: presets });

  const handleUpdatePreset = () => {
    showEditPresetDialog();
  };

  const upsertPreset = ({
    presetName,
    preset,
  }: {
    presetName: string;
    preset: Preset;
  }) => {
    setPresets((currentPresets) => ({
      ...currentPresets,
      [presetName]: preset,
    }));
    onSelect(presetName, preset);
  };

  return (
    <div>
      <h2 id="presets__title" tw="mb-2">
        Presets
      </h2>

      <Select
        id="preset__select"
        tw="w-full font-bold"
        aria-labelledby="presets__title"
        defaultValue=""
        value={selectedPresetName || ''}
        onChange={(event) => {
          const presetName = event.target.value;
          const selectedPreset = presets[presetName];
          onSelect(presetName, selectedPreset);
        }}
      >
        <option value="" disabled>
          {Object.keys(presets).length > 0 ? 'Select a preset' : 'No presets'}
        </option>
        {Object.keys(presets).map((key) => {
          return (
            <option key={key} value={key}>
              {key}
            </option>
          );
        })}
      </Select>

      {isEdited && (
        <Card tw="mt-4 mb-8 flex flex-col space-y-2 items-stretch">
          <h3
            role="status"
            tw="block text-lg font-bold text-center mb-1 text-green-500"
          >
            Preset edited
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (selectedPresetName) {
                onSelect(selectedPresetName, presets[selectedPresetName]);
              }
            }}
          >
            Restore
          </Button>
          <Button type="button" variant="outline" onClick={handleUpdatePreset}>
            Update preset
          </Button>
        </Card>
      )}

      <Divider />

      <div tw="flex flex-col space-y-2 items-stretch">
        <Button type="button" onClick={showAddPresetDialog}>
          Add to presets
        </Button>
        <Button
          type="button"
          onClick={() => {
            showManagePresetsDialog();
          }}
        >
          Manage presets
        </Button>
      </div>

      {renderAddPresetDialog({
        onSubmit: ({ presetName, preset }) => {
          upsertPreset({ presetName, preset });
        },
      })}

      {renderEditPresetDialog({
        onSave: ({ presetName, preset }) => {
          upsertPreset({ presetName, preset });
        },
      })}

      {renderManagePresetsDialog({
        onSave: (presets) => {
          setPresets(presets);
        },
      })}
    </div>
  );
};

export default Presets;
