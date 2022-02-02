import { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider, useIntl } from 'react-intl';
import 'twin.macro';

import filterEmptyProperties from './filterEmptyProperties';
import { DateTimeFormatOptions } from './types';

type Props = {
  locale: string;
  mode: 'default' | 'range';
  date: Date;
  endDate?: Date;
  options: DateTimeFormatOptions;
};

const ErrorFallback: FC<{ error: any }> = ({ error }) => {
  return (
    <div
      role="alert"
      tw="text-base bg-red-100 p-4 border-red-400 border rounded text-red-600"
    >
      <p tw="font-bold mb-2">Something went wrong:</p>
      <div tw="text-sm break-words whitespace-pre-line">{error.message}</div>
    </div>
  );
};

const Content: FC<Props> = ({ mode, date, endDate, options }) => {
  const intl = useIntl();
  const optionsWithoutEmptyProps = filterEmptyProperties(options);
  return (
    <div>
      {mode === 'range' && endDate
        ? intl.formatDateTimeRange(date, endDate, optionsWithoutEmptyProps)
        : intl.formatDate(date, optionsWithoutEmptyProps)}
    </div>
  );
};

const Preview: FC<Props> = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      resetKeys={Object.values(props)}
    >
      <IntlProvider
        locale={props.locale}
        onError={(error) => {
          throw new Error(
            error.message
              .split('\n')
              .filter(
                (line) =>
                  !!line.trim() &&
                  !/^at new DateTimeFormat|.+\.js|<anonymous>|\wError: \w/.test(
                    line
                  )
              )
              .join('\n')
          );
        }}
      >
        <Content {...props} />
      </IntlProvider>
    </ErrorBoundary>
  );
};

export default Preview;
