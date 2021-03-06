import { format, parse } from 'date-fns';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormatDateOptions } from 'react-intl';
import Modal from 'react-modal';
import tw, { styled } from 'twin.macro';

import Result from '../Result';
import { DateTimeFormatOptions } from '../types';
import filterEmptyProperties from '../filterEmptyProperties';
import Select from '../components/Select';
import Heading from '../components/Heading';
import Input from '../components/Input';
import Link from '../components/Link';
import Button from '../components/Button';
import CopyButton from '../components/CopyButton';
import {
  dateStyles,
  timeStyles,
  timeZoneNames,
  dayPeriods,
  hourCycles,
  weekdays,
  years,
  months,
  days,
  hours,
  minutes,
  seconds,
  Hour12Options,
} from './constants';

type FormFieldValues = {
  mode: 'default' | 'range';
  date: string;
  time: string;
  endDate: string;
  endTime: string;
} & DateTimeFormatOptions;

const rootElement = document.getElementById('root');

if (rootElement) {
  Modal.setAppElement(rootElement);
}

const Container = tw.div`p-12`;

const Layout = styled.div`
  ${tw`gap-x-8 flex flex-row`}

  @media (max-width: 80rem) {
    ${tw`flex-col`}
    grid-template-columns: 12rem minmax(640px, 1fr);
    grid-template-areas: 'form' 'aside results';
  }
`;

const Form = styled.form`
  ${tw`flex flex-col space-y-10`}
  min-width: 640px;
  flex: 1;
  grid-area: form;
`;

const Label = tw.label`font-mono w-40 text-right px-6`;

const SectionHeading = styled.h2`
  ${tw`mb-1 text-xl font-bold`}
`;

const FormRow = styled.div`
  ${tw`flex items-baseline`}

  > *:not(label) {
    flex: 1;
  }
`;

const DateTimeRow = styled.div`
  ${tw`flex items-baseline space-x-0.5`}
`;

const DateSection = styled.section`
  ${tw`flex flex-wrap`}
`;

const RadioButton = styled.input`
  display: none;

  & + label {
    ${tw`flex items-center justify-center box-border rounded px-4 h-11 text-base font-medium text-gray-800 select-none border-2 border-transparent`}
  }

  &:not(:checked) + label {
    ${tw`hover:underline cursor-pointer`}
  }

  &:checked + label {
    ${tw`font-bold border-2 border-gray-800`}
  }
`;

const FormatOptions = styled.section`
  ${tw`flex flex-wrap`}

  grid-column: 1 / span 2;
  grid-row: 2 / span 1;

  > div {
    ${tw`w-1/2 space-y-3 min-w-0`}
  }
`;

const Results = styled.section`
  flex: 1;
  min-width: 0;
`;

const DateTimeInput = tw(Input)`w-44`;

const OptionSelect = tw(Select)`font-mono font-bold`;

const App = () => {
  const { register, watch, getValues, reset } = useForm<FormFieldValues>({
    defaultValues: {
      mode: 'default',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm:ss'),
      endDate: format(Date.now() + 86400000, 'yyyy-MM-dd'),
      endTime: format(Date.now() + 86400000, 'HH:mm:ss'),
    },
  });

  const {
    mode,
    date,
    time,
    endDate,
    endTime,
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
  } = watch();

  const options: FormatDateOptions = useMemo(() => {
    const selectedOptions = {
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

    function convertHour12ValueToBoolean(obj: DateTimeFormatOptions) {
      return Object.entries(obj).reduce<FormatDateOptions>(
        (acc, [key, value]) => {
          if (key === 'hour12') {
            return { ...acc, hour12: value === Hour12Options.True };
          }
          return { ...acc, [key]: value };
        },
        {}
      );
    }

    return convertHour12ValueToBoolean(filterEmptyProperties(selectedOptions));
  }, [
    dateStyle,
    day,
    dayPeriod,
    hour,
    hour12,
    hourCycle,
    minute,
    month,
    second,
    timeStyle,
    timeZone,
    timeZoneName,
    weekday,
    year,
  ]);

  const renderSelect = ({
    label,
    id: idOrUndefined,
    name,
    options,
    isIdIsName = true,
    includeEmptyOption = true,
  }: {
    label: string;
    id?: string;
    name: keyof FormFieldValues;
    options: string[];
    isIdIsName?: boolean;
    includeEmptyOption?: boolean;
  }) => {
    const id = isIdIsName ? name : idOrUndefined;

    return (
      <FormRow>
        <Label htmlFor={id}>{label}</Label>
        <OptionSelect variant="solid" {...register(name)} id={id}>
          {includeEmptyOption && (
            <option key="" value="">
              -
            </option>
          )}
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </OptionSelect>
      </FormRow>
    );
  };

  const clearAllSelections = () => {
    const { mode, date, time, endDate, endTime } = getValues();
    reset({ mode, date, time, endDate, endTime });
  };

  return (
    <Container>
      <Heading tw="mb-8 whitespace-nowrap">Intl.DateTimeFormat Tester</Heading>

      <Layout>
        <Form>
          <DateSection>
            <SectionHeading tw="w-full mb-3">Date</SectionHeading>
            <fieldset tw="w-40 flex">
              <p>
                <RadioButton
                  id="mode__default"
                  type="radio"
                  {...register('mode')}
                  value="default"
                />
                <label htmlFor="mode__default">Time</label>
              </p>
              <p>
                <RadioButton
                  id="mode__range"
                  type="radio"
                  {...register('mode')}
                  value="range"
                />
                <label htmlFor="mode__range">Range</label>
              </p>
            </fieldset>

            <div tw="space-y-3 flex-1">
              <DateTimeRow>
                <Label htmlFor="date" tw="w-auto flex-1">
                  {mode === 'default' ? 'Date' : 'Start'}
                </Label>
                <DateTimeInput
                  variant="solid"
                  id="date"
                  {...register('date')}
                  type="date"
                  aria-label="Date"
                />
                <DateTimeInput
                  variant="solid"
                  id="time"
                  {...register('time')}
                  type="time"
                  step="1"
                  aria-label="Time"
                />
              </DateTimeRow>

              {mode === 'range' && (
                <DateTimeRow>
                  <Label htmlFor="endDate" tw="w-auto flex-1">
                    End
                  </Label>
                  <DateTimeInput
                    variant="solid"
                    id="endDate"
                    {...register('endDate')}
                    type="date"
                  />
                  <DateTimeInput
                    variant="solid"
                    id="time"
                    {...register('endTime')}
                    type="time"
                    step="1"
                    aria-label="Time"
                  />
                </DateTimeRow>
              )}
            </div>
          </DateSection>

          <FormatOptions>
            <header tw="flex flex-col w-full mb-2">
              <SectionHeading tw="w-full mb-3 flex flex-col">
                Format Options
                <div tw="text-base font-normal">
                  Learn more about these options at{' '}
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters">
                    MDN Web Docs
                  </Link>
                  .
                </div>
              </SectionHeading>
              <div tw="flex space-x-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllSelections}
                >
                  Clear all selections
                </Button>
                <CopyButton contentToCopy={JSON.stringify(options)}>
                  Copy as JSON
                </CopyButton>
              </div>
            </header>
            {renderSelect({
              label: 'dateStyle',
              name: 'dateStyle',
              options: dateStyles,
            })}

            {renderSelect({
              label: 'timeStyle',
              name: 'timeStyle',
              options: timeStyles,
            })}

            {renderSelect({
              label: 'timeZoneName',
              name: 'timeZoneName',
              options: timeZoneNames,
            })}

            <FormRow>
              <Label htmlFor="timeZone">timeZone</Label>
              <Input
                variant="solid"
                id="timeZone"
                type="text"
                {...register('timeZone')}
              />
            </FormRow>

            {renderSelect({
              label: 'dayPeriod',
              name: 'dayPeriod',
              options: dayPeriods,
            })}

            {renderSelect({
              label: 'hour12',
              name: 'hour12',
              options: [Hour12Options.True, Hour12Options.False],
            })}

            {renderSelect({
              label: 'hourCycle',
              name: 'hourCycle',
              options: hourCycles,
            })}

            {renderSelect({
              label: 'weekday',
              name: 'weekday',
              options: weekdays,
            })}

            {renderSelect({
              label: 'year',
              name: 'year',
              options: years,
            })}

            {renderSelect({
              label: 'month',
              name: 'month',
              options: months,
            })}

            {renderSelect({
              label: 'day',
              name: 'day',
              options: days,
            })}

            {renderSelect({
              label: 'hour',
              name: 'hour',
              options: hours,
            })}

            {renderSelect({
              label: 'minute',
              name: 'minute',
              options: minutes,
            })}

            {renderSelect({
              label: 'second',
              name: 'second',
              options: seconds,
            })}
          </FormatOptions>
        </Form>

        <Results>
          <SectionHeading tw="mb-3">Results</SectionHeading>
          <Result
            mode={mode}
            options={options}
            date={parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date())}
            endDate={parse(
              `${endDate} ${endTime}`,
              'yyyy-MM-dd HH:mm:ss',
              new Date()
            )}
          />
        </Results>
      </Layout>
    </Container>
  );
};

export default App;
