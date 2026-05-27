import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as DatePicker from '../date-picker/index';
import {
  CalendarContent,
  FieldRow,
  Hint,
  StyleWrapper,
} from './story-helpers';

const meta: Meta = {
  title: 'DatePicker/Locales',
  parameters: { layout: 'padded' },
};
export default meta;

function LocalePicker({ locale, label }: { locale: string; label: string }) {
  return (
    <StyleWrapper>
      <Hint>
        <code>{locale}</code> — week start and month/day names are locale-aware
      </Hint>
      <DatePicker.Root locale={locale} defaultValue={new Date()}>
        <DatePicker.Label className="dp-label">{label}</DatePicker.Label>
        <FieldRow>
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </FieldRow>
        <CalendarContent />
      </DatePicker.Root>
    </StyleWrapper>
  );
}

export const EnglishUS: StoryObj = {
  name: 'en-US (Sunday start)',
  render: () => <LocalePicker locale="en-US" label="Date (English US)" />,
};

export const EnglishGB: StoryObj = {
  name: 'en-GB (Monday start)',
  render: () => <LocalePicker locale="en-GB" label="Date (English UK)" />,
};

export const French: StoryObj = {
  name: 'fr-FR (Monday start)',
  render: () => <LocalePicker locale="fr-FR" label="Date (Français)" />,
};

export const Arabic: StoryObj = {
  name: 'ar (RTL, Saturday start)',
  render: () => (
    <StyleWrapper>
      <Hint>
        <code>ar</code> — Arabic locale with right-to-left text. Apply <code>dir="rtl"</code> for full RTL layout.
      </Hint>
      <div dir="rtl">
        <DatePicker.Root locale="ar" defaultValue={new Date()}>
          <DatePicker.Label className="dp-label">التاريخ</DatePicker.Label>
          <FieldRow>
            <DatePicker.Input className="dp-input" />
            <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
          </FieldRow>
          <CalendarContent />
        </DatePicker.Root>
      </div>
    </StyleWrapper>
  ),
};

export const Japanese: StoryObj = {
  name: 'ja-JP (Sunday start)',
  render: () => <LocalePicker locale="ja-JP" label="日付 (Japanese)" />,
};
