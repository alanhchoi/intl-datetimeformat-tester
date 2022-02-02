import { FC } from 'react';
import 'twin.macro';
import Card from './components/Card';
import Preview from './Preview';
import { DateTimeFormatOptions } from './types';

type Props = {
  mode: 'default' | 'range';
  date: Date;
  endDate?: Date;
  options: DateTimeFormatOptions;
};

const locales = ['en-US', 'ko-KR'];

const Result: FC<Props> = (props) => {
  return (
    <div tw="space-y-3">
      {locales.map((locale) => (
        <Card as="dd" key={locale} tw="text-2xl">
          <h3 tw="font-bold text-lg mb-2">{locale}</h3>
          <Preview locale={locale} {...props} />
        </Card>
      ))}
    </div>
  );
};

export default Result;
