import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as DatePicker from '../date-picker/index';
import type { DateRange } from '../types';
import {
  CalendarContent,
  FieldRow,
  Hint,
  Status,
  StyleWrapper,
  formatStoryDate,
} from './story-helpers';

const meta: Meta = {
  title: 'DatePicker/Range',
  parameters: { layout: 'padded' },
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    return (
      <StyleWrapper>
        <Status>
          {range.start && range.end
            ? `${formatStoryDate(range.start)} -> ${formatStoryDate(range.end)}`
            : range.start
              ? `From ${formatStoryDate(range.start)} - pick end date`
              : 'Pick start date'}
        </Status>
        <DatePicker.Root mode="range" onValueChange={setRange}>
          <DatePicker.Label className="dp-label">Date range</DatePicker.Label>
          <Hint>Each side is a segmented input. Focus either side and type a complete date.</Hint>
          <FieldRow>
            <DatePicker.Input index={0} className="dp-input" />
            <span style={{ color: '#9ca3af' }}>to</span>
            <DatePicker.Input index={1} className="dp-input" />
            <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
          </FieldRow>
          <CalendarContent />
        </DatePicker.Root>
      </StyleWrapper>
    );
  },
};

export const WithCalendarShorthand: StoryObj = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    return (
      <StyleWrapper>
        <Hint>
          Uses {'<DatePicker.Calendar />'} shorthand
        </Hint>
        <Status>
          {range.start && range.end
            ? `${formatStoryDate(range.start)} -> ${formatStoryDate(range.end)}`
            : 'No complete range selected'}
        </Status>
        <DatePicker.Root mode="range" onValueChange={setRange} defaultOpen>
          <DatePicker.Label className="dp-label">Trip dates</DatePicker.Label>
          <FieldRow>
            <DatePicker.Input index={0} className="dp-input" />
            <span style={{ color: '#9ca3af' }}>to</span>
            <DatePicker.Input index={1} className="dp-input" />
          </FieldRow>
          <DatePicker.Content className="dp-content">
            <DatePicker.Calendar />
          </DatePicker.Content>
        </DatePicker.Root>
      </StyleWrapper>
    );
  },
};
