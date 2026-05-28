"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DatePicker } from "@at5/kairo";

const schema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  bookingDate: z.date({
    message: "Booking date is required.",
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate >= today;
  }, {
    message: "Booking date must be today or in the future.",
  }),
});

type FormValues = z.infer<typeof schema>;

export function InteractiveRHFForm() {
  const [successData, setSuccessData] = useState<FormValues | null>(null);

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      bookingDate: undefined as unknown as Date,
    },
  });

  const onSubmit = (data: FormValues) => {
    setSuccessData(data);
    setTimeout(() => {
      setSuccessData(null);
      reset();
    }, 6000);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/20 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden mt-8">
      {/* Aerodynamic background highlights */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-white font-display flex items-center gap-2">
            <span className="text-blue-500 text-[10px]">●</span> Interactive Playground
          </h3>
          <p className="text-[11.5px] text-zinc-500 leading-normal">
            Submit the form below to experience live schema validation with Zod.
          </p>
        </div>

        {successData ? (
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/15 p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-650 text-[10px] text-white">✓</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Booking Complete!</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Thank you, <strong className="text-zinc-200">{successData.fullName}</strong>. Your reservation on{" "}
                  <strong className="text-zinc-200">{successData.bookingDate.toLocaleDateString()}</strong> has been successfully processed!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="rhf-fullname" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display select-none">
                Full name
              </label>
              <input
                id="rhf-fullname"
                type="text"
                placeholder="e.g. John Doe"
                {...register("fullName")}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "rhf-name-error" : undefined}
                className="w-full rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-[12.5px] text-white outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
              />
              {errors.fullName && (
                <p id="rhf-name-error" role="alert" className="text-[11px] font-semibold text-red-400 mt-1 pl-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Kairo DatePicker field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="rhf-date" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display select-none">
                Preferred Date
              </label>
              
              <Controller
                name="bookingDate"
                control={control}
                render={({ field }) => (
                  <DatePicker.Root
                    mode="single"
                    value={field.value}
                    onValueChange={field.onChange}
                    closeOnSelect={true}
                  >
                    <div className="relative">
                      <div 
                        id="rhf-date"
                        aria-invalid={!!errors.bookingDate}
                        aria-describedby={errors.bookingDate ? "rhf-date-error" : undefined}
                        className="flex w-full items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all group"
                      >
                        <DatePicker.Input
                          className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-650 flex items-center justify-between font-mono text-[12px] tracking-tight"
                        />
                        <DatePicker.Trigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                                        className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-medium text-zinc-350 hover:bg-zinc-900 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white aria-selected:hover:bg-blue-600 focus:bg-zinc-900 focus:text-white outline-none data-[outside-month=true]:text-zinc-700 data-[outside-month=true]:pointer-events-none aria-disabled:opacity-30 aria-disabled:pointer-events-none data-[today=true]:text-blue-500 data-[today=true]:font-bold transition-all duration-150"
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
                                  className="h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-900 focus:bg-zinc-900 outline-none aria-selected:bg-blue-600 aria-selected:text-white font-display"
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
                )}
              />
              {errors.bookingDate && (
                <p id="rhf-date-error" role="alert" className="text-[11px] font-semibold text-red-400 mt-1 pl-1">
                  {errors.bookingDate.message}
                </p>
              )}
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/10 active:scale-[0.99] disabled:opacity-50 select-none mt-2"
            >
              {isSubmitting ? "Submitting..." : "Schedule Appointment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
