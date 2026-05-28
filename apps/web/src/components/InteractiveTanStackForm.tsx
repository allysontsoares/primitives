"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker } from "@at5/kairo";
import * as z from "zod";

const fullNameSchema = z.string().min(3, { message: "Name must be at least 3 characters long." });
const dateSchema = z.date({
  message: "Booking date is required.",
}).refine((date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
}, {
  message: "Appointments are only available on weekdays (Monday to Friday).",
});

interface FormValues {
  fullName: string;
  bookingDate: Date | undefined;
}

export function InteractiveTanStackForm() {
  const [successData, setSuccessData] = useState<FormValues | null>(null);

  const form = useForm({
    defaultValues: {
      fullName: "",
      bookingDate: undefined as Date | undefined,
    },
    onSubmit: async ({ value }) => {
      if (!value.fullName || !value.bookingDate) return;
      setSuccessData(value as FormValues);
      setTimeout(() => {
        setSuccessData(null);
        form.reset();
      }, 6000);
    },
  });

  return (
    <div className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/20 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden mt-8">
      {/* Aerodynamic background highlights */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-6 max-w-md mx-auto">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-white font-display flex items-center gap-2">
            <span className="text-indigo-500 text-[10px]">●</span> Interactive Playground
          </h3>
          <p className="text-[11.5px] text-zinc-500 leading-normal">
            Submit the form below to experience live weekdays validation with TanStack Form.
          </p>
        </div>

        {successData ? (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/15 p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-650 text-[10px] text-white">✓</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Booking Complete!</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Thank you, <strong className="text-zinc-200">{successData.fullName}</strong>. Your weekday reservation on{" "}
                  <strong className="text-zinc-200">
                    {successData.bookingDate?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </strong>{" "}
                  has been successfully booked!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Full Name field */}
            <form.Field
              name="fullName"
              validators={{
                onChange: fullNameSchema,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor={field.name} className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display select-none">
                    Full name
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={field.state.meta.errors.length > 0 ? true : undefined}
                    aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-[12.5px] text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p id={`${field.name}-error`} role="alert" className="text-[11px] font-semibold text-red-400 mt-1 pl-1">
                      {field.state.meta.errors.map((err) => 
                        typeof err === "object" && err !== null && "message" in err 
                          ? (err as any).message 
                          : String(err)
                      ).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Kairo DatePicker field */}
            <form.Field
              name="bookingDate"
              validators={{
                onChange: dateSchema,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor={field.name} className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display select-none">
                    Select Weekday
                  </label>

                  <DatePicker.Root
                    mode="single"
                    value={field.state.value ?? null}
                    onValueChange={(val) => {
                      field.handleChange(val ?? undefined);
                    }}
                    closeOnSelect={true}
                  >
                    <div className="relative">
                      <div 
                        id={field.name}
                        aria-invalid={field.state.meta.errors.length > 0 ? true : undefined}
                        aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                        className="flex w-full items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all group"
                      >
                        <DatePicker.Input
                          className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-650 flex items-center justify-between font-mono text-[12px] tracking-tight"
                        />
                        <DatePicker.Trigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded p-1">
                          <svg xmlns="http://www.w3.org/2050/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                          </svg>
                        </DatePicker.Trigger>
                      </div>

                      <DatePicker.Content
                        portal={true}
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        className="w-[290px] rounded-xl border border-zinc-900 bg-black/95 p-3.5 shadow-2xl backdrop-blur-md transition-all"
                      >
                        <DatePicker.ViewControl className="flex items-center justify-between mb-2">
                          <DatePicker.PrevTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                          </DatePicker.PrevTrigger>
                          <DatePicker.ViewTrigger className="h-7 px-2 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors font-display" />
                          <DatePicker.NextTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                          </DatePicker.NextTrigger>
                        </DatePicker.ViewControl>

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
                                        className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-medium text-zinc-355 hover:bg-zinc-900 hover:text-white aria-selected:bg-indigo-600 aria-selected:text-white aria-selected:hover:bg-indigo-600 focus:bg-zinc-900 focus:text-white outline-none data-[outside-month=true]:text-zinc-700 data-[outside-month=true]:pointer-events-none aria-disabled:opacity-30 aria-disabled:pointer-events-none data-[today=true]:text-indigo-500 data-[today=true]:font-bold transition-all duration-150"
                                      />
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </DatePicker.Grid>
                        </DatePicker.View>
                        
                        <DatePicker.View view="month">
                          <DatePicker.MonthGrid className="grid grid-cols-3 gap-1.5 mt-2">
                            {({ months }) =>
                              months.map((m) => (
                                <DatePicker.MonthCell 
                                  key={m.value} 
                                  value={m.value} 
                                  disabled={m.isDisabled}
                                  className="h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-900 focus:bg-zinc-900 outline-none aria-selected:bg-indigo-600 aria-selected:text-white font-display"
                                >
                                  {m.label.slice(0, 3)}
                                </DatePicker.MonthCell>
                              ))
                            }
                          </DatePicker.MonthGrid>
                        </DatePicker.View>

                        <DatePicker.View view="year">
                          <DatePicker.YearGrid className="grid grid-cols-3 gap-1.5 mt-2">
                            {({ years }) =>
                              years.map((y) => (
                                <DatePicker.YearCell 
                                  key={y.value} 
                                  value={y.value} 
                                  disabled={y.isDisabled}
                                  className="h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-350 hover:bg-zinc-900 focus:bg-zinc-900 outline-none aria-selected:bg-indigo-600 aria-selected:text-white font-display"
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
                  
                  {field.state.meta.errors.length > 0 && (
                    <p id={`${field.name}-error`} role="alert" className="text-[11px] font-semibold text-red-400 mt-1 pl-1">
                      {field.state.meta.errors.map((err) => 
                        typeof err === "object" && err !== null && "message" in err 
                          ? (err as any).message 
                          : String(err)
                      ).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Action Trigger */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.99] disabled:opacity-50 select-none mt-2"
                >
                  {isSubmitting ? "Submitting..." : "Schedule Weekday Appointment"}
                </button>
              )}
            </form.Subscribe>
          </form>
        )}
      </div>
    </div>
  );
}
