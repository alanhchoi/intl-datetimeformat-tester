import { FC, useMemo, useRef, useState } from 'react';
import produce from 'immer';
import tw, { styled } from 'twin.macro';
import YAML from 'yaml';

import Dialog from './components/Dialog';
import convertPresetToYaml from './convertPresetToYaml';
import { Preset } from './types';
import PresetPreview from './PresetPreview';
import filterEmptyProperties from './filterEmptyProperties';
import FileSaver from 'file-saver';
import Button from './components/Button';
import DialogAction from './components/DialogAction';

type Props = {
  isOpen: boolean;
  close: () => void;
  currentPresets: Record<string, Preset>;
  onSave: (presets: Record<string, Preset>) => void;
};

type Selection = { value: string; index: number };

const Layout = styled.div`
  ${tw`grid gap-4`}

  grid-template-columns: 2fr 3fr;
  grid-template-rows: auto 10rem 6rem;
  grid-template-areas: 'top top' 'list content' 'list results';
`;

const TopActions = styled.div`
  ${tw`flex gap-x-2 items-stretch`}

  grid-area: top;

  [role='separator'] {
    ${tw`w-px bg-gray-300 border-0 mx-2`}
  }
`;

const Content = styled.pre`
  ${tw`border p-4 rounded`};

  grid-area: content;
  overflow-y: auto;
`;

const Example = styled.dl`
  ${tw`grid gap-x-2 gap-y-3 border p-4 rounded`};
  grid-template-columns: 4rem 1fr;
  grid-area: results;

  dt {
    ${tw`text-right font-semibold`}
  }

  dd {
    ${tw`truncate`}
  }
`;

const ManagePresetsDialog: FC<Props> = ({
  isOpen,
  close,
  currentPresets,
  onSave,
}) => {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [presets, setPresets] = useState(currentPresets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetNames = Object.keys(presets);

  const isSelectionConsecutive = useMemo(() => {
    return selections.every(
      (item, index, list) =>
        index === 0 || item.index === list[index - 1].index + 1
    );
  }, [selections]);

  const renderPreview = () => {
    if (selections.length !== 1) {
      return null;
    }
    const preset = presets[selections[0].value];

    if (preset == null) {
      return null;
    }

    return (
      <>
        <Content>{convertPresetToYaml(preset)}</Content>
        <Example>
          <dt>en-US</dt>
          <dd>
            <PresetPreview
              locale="en-US"
              date={new Date()}
              mode="default"
              options={preset}
            />
          </dd>
          <dt>ko-KR</dt>
          <dd>
            <PresetPreview
              locale="ko-KR"
              date={new Date()}
              mode="default"
              options={preset}
            />
          </dd>
        </Example>
      </>
    );
  };

  return (
    <Dialog isOpen={isOpen} close={close} title="Manage presets" width="48rem">
      <Layout>
        <TopActions>
          <Button
            variant="filled"
            type="button"
            disabled={selections.length !== 1}
            onClick={() => {
              const [selection] = selections;

              const newName = window.prompt(
                `Enter a new name for the preset “${selection.value}”`,
                selection.value
              );

              if (!newName || newName === selection.value) {
                return;
              }

              setPresets(
                produce((presets) => {
                  const preset = presets[selection.value];
                  delete presets[selection.value];
                  presets[newName] = preset;
                })
              );
              setSelections(
                produce((selections) => {
                  selections[0].value = newName;
                })
              );
            }}
          >
            Rename
          </Button>

          <Button
            variant="filled"
            type="button"
            disabled={
              selections.length === 0 ||
              !isSelectionConsecutive ||
              selections[0]?.index === 0
            }
            onClick={() => {
              const [firstSelection] = selections;
              const nextTolastSelectionIndex =
                firstSelection.index + selections.length;

              setPresets((presets) => {
                const entries = Object.entries(presets);

                const reorderedEntries = [
                  ...entries.slice(0, firstSelection.index - 1),
                  ...entries.slice(
                    firstSelection.index,
                    nextTolastSelectionIndex
                  ),
                  entries[firstSelection.index - 1],
                  ...entries.slice(nextTolastSelectionIndex),
                ];

                return reorderedEntries.reduce<typeof presets>(
                  (acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                  },
                  {}
                );
              });

              setSelections(
                produce((selections) => {
                  selections.forEach((selection) => {
                    selection.index -= 1;
                  });
                })
              );
            }}
          >
            Move up
          </Button>

          <Button
            variant="filled"
            type="button"
            disabled={
              selections.length === 0 ||
              !isSelectionConsecutive ||
              selections[selections.length - 1]?.index ===
                presetNames.length - 1
            }
            onClick={() => {
              const [firstSelection] = selections;
              const nextTolastSelectionIndex =
                firstSelection.index + selections.length;

              setPresets((presets) => {
                const entries = Object.entries(presets);

                const reorderedEntries = [
                  ...entries.slice(0, firstSelection.index),
                  entries[nextTolastSelectionIndex],
                  ...entries.slice(
                    firstSelection.index,
                    nextTolastSelectionIndex
                  ),
                  ...entries.slice(nextTolastSelectionIndex),
                ];

                return reorderedEntries.reduce<typeof presets>(
                  (acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                  },
                  {}
                );
              });

              setSelections(
                produce((selections) => {
                  selections.forEach((selection) => {
                    selection.index += 1;
                  });
                })
              );
            }}
          >
            Move down
          </Button>

          <Button
            variant="filled"
            type="button"
            disabled={selections.length === 0}
            onClick={() => {
              setPresets(
                produce((presets) => {
                  selections.forEach(({ value }) => {
                    delete presets[value];
                  });
                })
              );
              setSelections([]);
            }}
          >
            Delete
          </Button>

          <div role="separator" />

          <Button
            type="button"
            onClick={() => {
              setPresets(currentPresets);
              setSelections([]);
            }}
          >
            Reset
          </Button>

          <Button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            Import
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            hidden={true}
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];

              if (selectedFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const result = event.target!.result as string;

                  try {
                    setPresets(YAML.parse(result, { sortMapEntries: true }));
                  } catch (error) {
                    alert('Failed to read file!\n\n' + error);
                  }
                };

                reader.onerror = () => {
                  alert('Failed to read file!\n\n' + reader.error);
                  reader.abort();
                };

                reader.readAsText(selectedFile);
              }

              event.target.value = '';
            }}
          />

          <Button
            type="button"
            onClick={() => {
              const copiedPresets = { ...presets };
              Object.keys(copiedPresets).forEach((key) => {
                copiedPresets[key] = filterEmptyProperties(copiedPresets[key]);
              });
              var blob = new Blob([YAML.stringify(copiedPresets)], {
                type: 'application/x-yaml;charset=utf-8',
              });
              FileSaver.saveAs(blob, 'intl-dateformat-tester-presets.yaml');
            }}
          >
            Export
          </Button>
        </TopActions>

        <select
          css="grid-area: list;"
          tw="border rounded"
          value={selections.map(({ value }) => value)}
          multiple={true}
          onChange={(event) => {
            const selectedPresetNames: Selection[] = [];
            for (let i = 0; i < event.target.selectedOptions.length; i += 1) {
              const { value, index } = event.target.selectedOptions[i];
              selectedPresetNames.push({ value, index });
            }
            setSelections(selectedPresetNames);
          }}
        >
          {presetNames.map((presetName) => (
            <option key={presetName} value={presetName}>
              {presetName}
            </option>
          ))}
        </select>

        {renderPreview()}
      </Layout>

      <DialogAction>
        <Button variant="ghost" type="button" onClick={close}>
          Cancel
        </Button>

        <Button
          variant="cta"
          type="submit"
          onClick={() => {
            onSave(presets);
            close();
          }}
        >
          Save
        </Button>
      </DialogAction>
    </Dialog>
  );
};

export default ManagePresetsDialog;
