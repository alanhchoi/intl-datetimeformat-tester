import { FC } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { theme } from 'twin.macro';
import Button from './components/Button';

import Dialog from './components/Dialog';
import DialogAction from './components/DialogAction';
import Input from './components/Input';
import convertPresetToYaml from './convertPresetToYaml';
import { Preset } from './types';

type Props = {
  isOpen: boolean;
  presetName: string;
  preset: Preset;
  currentFormatOptions: Preset;
  close: () => void;
  onSave: (data: { presetName: string; preset: Preset }) => void;
};

const EditPresetDialog: FC<Props> = ({
  isOpen,
  presetName,
  preset,
  currentFormatOptions,
  close,
  onSave,
}) => {
  const presetYaml = convertPresetToYaml(preset);
  const updatedPresetYaml = convertPresetToYaml(currentFormatOptions);

  return (
    <Dialog isOpen={isOpen} close={close} title="Edit preset">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ presetName, preset: currentFormatOptions });
          close();
        }}
        tw="space-y-6"
      >
        <div tw="flex flex-col space-y-1">
          <span>Preset name</span>
          <Input as="span" variant="solid">
            {presetName}
          </Input>
        </div>

        <div tw="flex flex-col space-y-1 border-b">
          <span>Changes</span>
          <ReactDiffViewer
            oldValue={presetYaml}
            newValue={updatedPresetYaml}
            splitView={false}
            styles={{ contentText: { fontSize: theme`fontSize.sm` } }}
          />
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

export default EditPresetDialog;
