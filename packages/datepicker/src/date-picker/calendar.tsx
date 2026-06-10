import React from "react";
import { ViewControl } from "./view-control";
import { PrevTrigger } from "./prev-trigger";
import { NextTrigger } from "./next-trigger";
import { ViewTrigger } from "./view-trigger";
import { View } from "./view";
import { WeekDays } from "./week-days";
import { Grid } from "./grid";
import { MonthGrid } from "./month-grid";
import { MonthCell } from "./month-cell";
import { YearGrid } from "./year-grid";
import { YearCell } from "./year-cell";

export interface CalendarProps {
  className?: string;
}

export function Calendar({ className }: CalendarProps) {
  return (
    <div className={className}>
      <ViewControl>
        <PrevTrigger />
        <ViewTrigger />
        <NextTrigger />
      </ViewControl>

      <View view="day">
        <Grid header={<WeekDays />} />
      </View>

      <View view="month">
        <MonthGrid>
          {({ months }) => (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {months.map((m) => (
                <MonthCell
                  key={m.value}
                  value={m.value}
                  disabled={m.isDisabled}
                  title={m.label}
                  aria-label={m.label}
                >
                  {m.shortLabel}
                </MonthCell>
              ))}
            </div>
          )}
        </MonthGrid>
      </View>

      <View view="year">
        <YearGrid>
          {({ years }) => (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
              {years.map((y) => (
                <YearCell key={y.value} value={y.value} disabled={y.isDisabled}>
                  {y.value}
                </YearCell>
              ))}
            </div>
          )}
        </YearGrid>
      </View>
    </div>
  );
}
