"use client";

import { DatePicker } from "@at5/kairo";

export function DemoDatePicker() {
  return (
    <DatePicker.Root mode="single" locale="en-US">
      <div className="flex flex-col gap-2 w-72 mx-auto text-left relative z-50">
        <DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display select-none">
          Appointment Date
        </DatePicker.Label>
        
        {/* Input wrapping container */}
        <div className="flex w-full items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/80 px-4 py-2.5 text-[13px] focus-within:ring-2 focus-within:ring-blue-600/35 focus-within:border-blue-500 transition-all group">
          <DatePicker.Input className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-650 flex items-center justify-between font-mono text-[12px] tracking-tight" />
          <DatePicker.Trigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </DatePicker.Trigger>
        </div>

        {/* Calendar Popover */}
        <DatePicker.Content portal={true} side="bottom" align="start" sideOffset={6} className="w-[290px] rounded-xl border border-zinc-900 bg-black/95 p-3.5 shadow-2xl backdrop-blur-md transition-all">
          <DatePicker.ViewControl className="flex items-center justify-between mb-2">
            <DatePicker.PrevTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </DatePicker.PrevTrigger>
            
            <DatePicker.ViewTrigger className="h-7 px-2 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors font-display" />

            <DatePicker.NextTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </DatePicker.NextTrigger>
          </DatePicker.ViewControl>

          {/* Day View */}
          <DatePicker.View view="day">
            <DatePicker.Grid header={<DatePicker.WeekDays className="flex w-full mb-1.5 text-zinc-650 font-bold text-[10px] uppercase font-display" />} className="w-full border-collapse space-y-1">
              {({ weeks }) => (
                <tbody className="flex flex-col gap-1">
                  {weeks.map((week, wi) => (
                    <tr key={wi} className="flex w-full justify-between mt-0.5">
                      {week.map((day, di) => (
                        <DatePicker.Day 
                          key={di} 
                          date={day} 
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-medium text-zinc-350 hover:bg-zinc-900 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white aria-selected:hover:bg-blue-600 focus:bg-zinc-900 focus:text-white outline-none data-[outside-month=true]:text-zinc-700 data-[outside-month=true]:pointer-events-none aria-disabled:opacity-30 aria-disabled:pointer-events-none data-[today=true]:text-blue-500 data-[today=true]:font-bold transition-all duration-150"
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </DatePicker.Grid>
          </DatePicker.View>
          
          {/* Month View */}
          <DatePicker.View view="month">
            <DatePicker.MonthGrid className="grid grid-cols-3 gap-1.5 mt-2">
              {({ months }) =>
                months.map((m) => (
                  <DatePicker.MonthCell 
                    key={m.value} 
                    value={m.value} 
                    disabled={m.isDisabled}
                    className="h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-900 focus:bg-zinc-900 outline-none aria-selected:bg-blue-600 aria-selected:text-white font-display"
                  >
                    {m.label.slice(0, 3)}
                  </DatePicker.MonthCell>
                ))
              }
            </DatePicker.MonthGrid>
          </DatePicker.View>

          {/* Year View */}
          <DatePicker.View view="year">
            <DatePicker.YearGrid className="grid grid-cols-3 gap-1.5 mt-2">
              {({ years }) =>
                years.map((y) => (
                  <DatePicker.YearCell 
                    key={y.value} 
                    value={y.value} 
                    disabled={y.isDisabled}
                    className="h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-900 focus:bg-zinc-900 outline-none aria-selected:bg-blue-600 aria-selected:text-white font-display"
                  >
                    {y.value}
                  </DatePicker.YearCell>
                ))
              }
            </DatePicker.YearGrid>
          </DatePicker.View>
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}
