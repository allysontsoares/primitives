import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "../index";
import {
  CalendarContent,
  FieldRow,
  Hint,
  Status,
  StyleWrapper,
  formatStoryDate,
} from "./story-helpers";

const LOCALES = ["en-US", "en-GB", "pt-BR", "fr-FR", "ja-JP", "ar"] as const;

const meta: Meta = {
  title: "DatePicker/Multiple",
  parameters: { layout: "padded" },
  argTypes: {
    locale: {
      control: "select",
      options: LOCALES,
      description: "Locale — controls segment order, separator, and calendar names",
      defaultValue: "en-US",
    },
  },
};
export default meta;

export const Default: StoryObj<{ locale: string }> = {
  args: { locale: "en-US" },
  render: ({ locale }) => {
    const [dates, setDates] = useState<Date[]>([]);
    return (
      <StyleWrapper>
        <Status>
          {dates.length === 0
            ? "No dates selected"
            : `${dates.length} date(s): ${dates.map(formatStoryDate).join(", ")}`}
        </Status>
        <DatePicker.Root mode="multiple" onValueChange={setDates} defaultOpen locale={locale}>
          <DatePicker.Label className="dp-label">Select multiple dates</DatePicker.Label>
          <Hint>
            Pick dates in the calendar or type a complete date into the segmented input to toggle
            it.
          </Hint>
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
