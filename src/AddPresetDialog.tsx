import { FC, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import 'twin.macro';
import Button from './components/Button';

import Dialog from './components/Dialog';
import DialogAction from './components/DialogAction';
import Input from './components/Input';
import convertPresetToYaml from './convertPresetToYaml';
import { Preset } from './types';

type Props = {
  isOpen: boolean;
  preset: Preset;
  existingPresetNames: string[];
  close: () => void;
  onSubmit: (data: { presetName: string; preset: Preset }) => void;
};

const AddPresetDialog: FC<Props> = ({
  isOpen,
  preset,
  close,
  onSubmit,
  existingPresetNames,
}) => {
  const { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { presetName: '' },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref: hookFormInputRef, ...registerPresetName } = register(
    'presetName',
    {
      required: true,
      validate: (value: string) => {
        if (!value.trim()) {
          return 'There are only whitespaces.';
        }
        if (existingPresetNames.includes(value.trim())) {
          return 'A preset with the name already exists.';
        }
        return true;
      },
    }
  );

  useEffect(() => {
    reset();
  }, [preset, reset]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      formState.errors.presetName?.message ?? ''
    );
  }, [formState.errors.presetName]);

  const previewContent = convertPresetToYaml(preset);

  return (
    <Dialog isOpen={isOpen} close={close} title="Add to presets">
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit({ presetName: data.presetName.trim(), preset });
          close();
        })}
        tw="flex flex-col items-stretch"
      >
        <div tw="space-y-6">
          <pre tw="bg-gray-50 font-mono p-4 rounded">{previewContent}</pre>

          <div tw="flex flex-col space-y-1">
            <label htmlFor="add-preset-name">Preset name</label>
            <Input
              id="add-preset-name"
              type="text"
              {...registerPresetName}
              ref={(node) => {
                hookFormInputRef(node);
                inputRef.current = node;
              }}
            />
          </div>
        </div>

        <DialogAction>
          <Button variant="ghost" type="button" onClick={close}>
            Cancel
          </Button>
          <Button variant="cta" type="submit">
            Save
          </Button>
        </DialogAction>
      </form>
    </Dialog>
  );
};

export default AddPresetDialog;
