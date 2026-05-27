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
  title: 'DatePicker/Single',
  parameters: { layout: 'padded' },
};
export default meta;

// ─── Stories ────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <StyleWrapper>
      <DatePicker.Root defaultValue={new Date()}>
        <DatePicker.Label className="dp-label">Select date</DatePicker.Label>
        <Hint>Click a segment and type digits. The calendar opens without taking focus from the input.</Hint>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const Uncontrolled: StoryObj = {
  render: () => (
    <StyleWrapper>
      <DatePicker.Root>
        <DatePicker.Label className="dp-label">No default value</DatePicker.Label>
        <Hint>Empty values render segment placeholders: month, day, and year.</Hint>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const SelectionCallback: StoryObj = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2024, 5, 15));
    return (
      <StyleWrapper>
        <Status>Selected: {formatStoryDate(value)}</Status>
        <DatePicker.Root defaultValue={value} onValueChange={setValue}>
          <DatePicker.Label className="dp-label">Selection callback</DatePicker.Label>
          <FieldRow>
            <DatePicker.Input className="dp-input" />
            <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
          </FieldRow>
          <CalendarContent />
        </DatePicker.Root>
      </StyleWrapper>
    );
  },
};

export const KeyboardEntry: StoryObj = {
  render: () => (
    <StyleWrapper>
      <DatePicker.Root defaultOpen={false}>
        <DatePicker.Label className="dp-label">Keyboard entry</DatePicker.Label>
        <Hint>
          Try month <code>3</code>, or <code>12</code>, then day and year. Arrow keys increment,
          decrement, and move between segments.
        </Hint>
        <FieldRow>
          <DatePicker.Input
            className="dp-input"
            segmentLabels={{ month: 'Booking month', day: 'Booking day', year: 'Booking year' }}
          />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const WithMinMax: StoryObj = {
  render: () => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), 1);
    const max = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    return (
      <StyleWrapper>
        <Hint>Only allows dates within the next 2 months.</Hint>
        <DatePicker.Root minDate={min} maxDate={max}>
          <DatePicker.Label className="dp-label">Book a slot</DatePicker.Label>
          <FieldRow>
            <DatePicker.Input className="dp-input" />
            <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
          </FieldRow>
          <CalendarContent />
        </DatePicker.Root>
      </StyleWrapper>
    );
  },
};

export const DisabledWeekends: StoryObj = {
  render: () => (
    <StyleWrapper>
      <Hint>Weekends are disabled.</Hint>
      <DatePicker.Root disabled={(d) => d.getDay() === 0 || d.getDay() === 6}>
        <DatePicker.Label className="dp-label">Weekdays only</DatePicker.Label>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const Inline: StoryObj = {
  render: () => (
    <StyleWrapper>
      <DatePicker.Root defaultValue={new Date()} defaultOpen>
        <DatePicker.Label className="dp-label">Inline calendar</DatePicker.Label>
        <Hint>Opened by default. Use the view trigger to switch between day, month, and year views.</Hint>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const FrenchLocale: StoryObj = {
  render: () => (
    <StyleWrapper>
      <DatePicker.Root locale="fr-FR" defaultValue={new Date()}>
        <DatePicker.Label className="dp-label">Date (fr-FR)</DatePicker.Label>
        <Hint>The segmented order and separators follow the locale.</Hint>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const ReadOnly: StoryObj = {
  render: () => (
    <StyleWrapper>
      <Hint>Read-only: the displayed date cannot be changed. Segment editing and calendar selection are both blocked.</Hint>
      <DatePicker.Root defaultValue={new Date(2024, 5, 15)} readOnly>
        <DatePicker.Label className="dp-label">Read-only date</DatePicker.Label>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const ForceMountAnimation: StoryObj = {
  render: () => (
    <StyleWrapper>
      <style>{`
        @keyframes dp-slide-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dp-slide-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-6px); }
        }
        .dp-content-animated[data-state="open"]  { animation: dp-slide-in  150ms ease forwards; }
        .dp-content-animated[data-state="closed"] { animation: dp-slide-out 150ms ease forwards; }
      `}</style>
      <Hint>
        Uses <code>forceMount</code> so the popup stays in the DOM during the exit animation
        (triggered by <code>[data-state="closed"]</code>).
      </Hint>
      <DatePicker.Root defaultValue={new Date()}>
        <DatePicker.Label className="dp-label">Animated calendar</DatePicker.Label>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent forceMount className="dp-content-animated" />
      </DatePicker.Root>
    </StyleWrapper>
  ),
};

export const CustomDayRender: StoryObj = {
  render: () => (
    <StyleWrapper>
      <DatePicker.Root defaultValue={new Date()}>
        <DatePicker.Label className="dp-label">Custom day rendering</DatePicker.Label>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <DatePicker.Content className="dp-content">
          <DatePicker.ViewControl className="dp-view-control">
            <DatePicker.PrevTrigger className="dp-nav-btn" />
            <DatePicker.ViewTrigger className="dp-view-trigger" />
            <DatePicker.NextTrigger className="dp-nav-btn" />
          </DatePicker.ViewControl>
          <DatePicker.View view="day">
            <DatePicker.Grid
              className="dp-grid"
              header={<DatePicker.WeekDays />}
            >
              {({ weeks }) =>
                weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => (
                      <DatePicker.Day
                        key={di}
                        date={day}
                        className="dp-day"
                        style={{ position: 'relative' }}
                      >
                        {({ date, isSelected, isToday }) => (
                          <>
                            {date.getDate()}
                            {isToday && (
                              <span style={{
                                position: 'absolute',
                                bottom: 2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                background: isSelected ? '#fff' : '#2563eb',
                              }} />
                            )}
                          </>
                        )}
                      </DatePicker.Day>
                    ))}
                  </tr>
                ))
              }
            </DatePicker.Grid>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </StyleWrapper>
  ),
};
