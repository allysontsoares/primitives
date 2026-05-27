import React from 'react';
import * as DatePicker from '../date-picker/index';
import { baseCalendarStyles } from './styles';

export function StyleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{baseCalendarStyles}</style>
      {children}
    </>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="dp-field-row">{children}</div>;
}

export function Hint({ children }: { children: React.ReactNode }) {
  return <div className="dp-hint">{children}</div>;
}

export function Status({ children }: { children: React.ReactNode }) {
  return <div className="dp-status">{children}</div>;
}

export function CalendarContent({
  forceMount,
  className,
}: {
  forceMount?: boolean;
  className?: string;
}) {
  const contentClassName = ['dp-content', className].filter(Boolean).join(' ');

  return (
    <DatePicker.Content
      {...(forceMount !== undefined ? { forceMount } : {})}
      className={contentClassName}
    >
      <DatePicker.ViewControl className="dp-view-control">
        <DatePicker.PrevTrigger className="dp-nav-btn" />
        <DatePicker.ViewTrigger className="dp-view-trigger" />
        <DatePicker.NextTrigger className="dp-nav-btn" />
      </DatePicker.ViewControl>

      <DatePicker.View view="day">
        <DatePicker.Grid className="dp-grid" header={<DatePicker.WeekDays />}>
          {({ weeks }) =>
            weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <DatePicker.Day key={di} date={day} className="dp-day" />
                ))}
              </tr>
            ))
          }
        </DatePicker.Grid>
      </DatePicker.View>

      <DatePicker.View view="month">
        <DatePicker.MonthGrid className="dp-month-grid">
          {({ months }) => (
            <>
              {months.map((month) => (
                <DatePicker.MonthCell
                  key={month.value}
                  value={month.value}
                  disabled={month.isDisabled}
                  className="dp-month-cell"
                >
                  {month.label.slice(0, 3)}
                </DatePicker.MonthCell>
              ))}
            </>
          )}
        </DatePicker.MonthGrid>
      </DatePicker.View>

      <DatePicker.View view="year">
        <DatePicker.YearGrid className="dp-year-grid">
          {({ years }) => (
            <>
              {years.map((year) => (
                <DatePicker.YearCell
                  key={year.value}
                  value={year.value}
                  disabled={year.isDisabled}
                  className="dp-year-cell"
                >
                  {year.value}
                </DatePicker.YearCell>
              ))}
            </>
          )}
        </DatePicker.YearGrid>
      </DatePicker.View>
    </DatePicker.Content>
  );
}

export function formatStoryDate(date: Date | null) {
  return date
    ? date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'none';
}
