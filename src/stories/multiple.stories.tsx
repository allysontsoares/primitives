import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as DatePicker from '../date-picker/index';
import {
  CalendarContent,
  FieldRow,
  Hint,
  Status,
  StyleWrapper,
  formatStoryDate,
} from './story-helpers';

const meta: Meta = {
  title: 'DatePicker/Multiple',
  parameters: { layout: 'padded' },
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [dates, setDates] = useState<Date[]>([]);
    return (
      <StyleWrapper>
        <Status>
          {dates.length === 0
            ? 'No dates selected'
            : `${dates.length} date(s): ${dates.map(formatStoryDate).join(', ')}`}
        </Status>
        <DatePicker.Root mode="multiple" onValueChange={setDates} defaultOpen>
          <DatePicker.Label className="dp-label">Select multiple dates</DatePicker.Label>
          <Hint>Pick dates in the calendar or type a complete date into the segmented input to toggle it.</Hint>
          <FieldRow>
            <DatePicker.Input className="dp-input" />
            <DatePicker.Trigger className="dp-trigger">📅 Open calendar</DatePicker.Trigger>
          </FieldRow>
          <CalendarContent />
        </DatePicker.Root>
      </StyleWrapper>
    );
  },
};
