import React from "react";
import { DatePicker } from "@at5/kairo";

export function Calendar() {
  return (
    <DatePicker.Content className="absolute z-50 mt-1 w-[272px] rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-xl shadow-black/40">
      <DatePicker.ViewControl className="mb-2 flex items-center justify-between">
        <DatePicker.PrevTrigger className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" />
        <DatePicker.ViewTrigger className="rounded-lg px-2 py-1 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors" />
        <DatePicker.NextTrigger className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" />
      </DatePicker.ViewControl>

      <DatePicker.View view="day">
        <DatePicker.Grid
          className="w-full border-collapse"
          header={
            <DatePicker.WeekDays className="[&>th]:pb-1 [&>th]:text-center [&>th]:text-[11px] [&>th]:font-medium [&>th]:text-zinc-500" />
          }
        >
          {({ weeks }) =>
            weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <DatePicker.Day
                    key={di}
                    date={day}
                    className="h-8 w-8 rounded-lg text-center text-[13px] transition-colors select-none
                      data-[outside-month]:text-zinc-600
                      data-[disabled]:cursor-not-allowed data-[disabled]:text-zinc-700
                      data-[today]:font-bold data-[today]:not-data-[selected]:text-blue-400
                      data-[in-range]:bg-blue-950 data-[in-range]:rounded-none
                      data-[range-start]:bg-blue-600 data-[range-start]:text-white data-[range-start]:rounded-lg
                      data-[range-end]:bg-blue-600 data-[range-end]:text-white data-[range-end]:rounded-lg
                      data-[selected]:bg-blue-600 data-[selected]:text-white
                      not-data-[selected]:not-data-[disabled]:not-data-[in-range]:hover:bg-zinc-800
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
                  />
                ))}
              </tr>
            ))
          }
        </DatePicker.Grid>
      </DatePicker.View>

      <DatePicker.View view="month">
        <DatePicker.MonthGrid className="grid grid-cols-3 gap-1 py-1">
          {({ months }) => (
            <>
              {months.map((month) => (
                <DatePicker.MonthCell
                  key={month.value}
                  value={month.value}
                  disabled={month.isDisabled}
                  className="cursor-pointer rounded-lg py-2 text-center text-xs text-zinc-300 transition-colors
                    hover:bg-zinc-800
                    data-[selected]:bg-blue-600 data-[selected]:text-white
                    disabled:cursor-not-allowed disabled:text-zinc-600"
                >
                  {month.label.slice(0, 3)}
                </DatePicker.MonthCell>
              ))}
            </>
          )}
        </DatePicker.MonthGrid>
      </DatePicker.View>

      <DatePicker.View view="year">
        <DatePicker.YearGrid className="grid grid-cols-4 gap-1 py-1">
          {({ years }) => (
            <>
              {years.map((year) => (
                <DatePicker.YearCell
                  key={year.value}
                  value={year.value}
                  disabled={year.isDisabled}
                  className="cursor-pointer rounded-lg py-2 text-center text-xs text-zinc-300 transition-colors
                    hover:bg-zinc-800
                    data-[selected]:bg-blue-600 data-[selected]:text-white
                    disabled:cursor-not-allowed disabled:text-zinc-600"
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
