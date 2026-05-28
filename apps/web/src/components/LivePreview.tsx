"use client";

import { DatePicker } from "@at5/kairo";
import { useState } from "react";

type Mode = "single" | "range" | "multiple";
type Locale = "en-US" | "pt-BR" | "ar" | "ja-JP";

export function LivePreview() {
	const [mode, setMode] = useState<Mode>("single");
	const [locale, setLocale] = useState<Locale>("en-US");
	const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
	const [copied, setCopied] = useState(false);

	const [singleDate, setSingleDate] = useState<Date | null>(null);
	const [rangeDate, setRangeDate] = useState<{
		start: Date | null;
		end: Date | null;
	}>({ start: null, end: null });
	const [multipleDates, setMultipleDates] = useState<Date[]>([]);

	const handleCopy = () => {
		navigator.clipboard.writeText(getCodeString());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const getCodeString = () => {
		if (mode === "single") {
			return `import { DatePicker } from "@at5/kairo";
import { useState } from "react";

export function SingleDatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker.Root
      mode="single"
      locale="${locale}"
      value={date}
      onValueChange={setDate}
    >
      <div className="flex flex-col gap-2 w-72">
        <DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display">
          Pick a date
        </DatePicker.Label>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue-600/35">
          <DatePicker.Input className="flex-1 bg-transparent text-white outline-none font-mono text-[12px]" />
          <DatePicker.Trigger className="text-zinc-500 hover:text-white">
            📅
          </DatePicker.Trigger>
        </div>

        <DatePicker.Content portal={true} side="bottom" align="start" sideOffset={6} className="w-[290px] rounded-xl border border-zinc-900 bg-black/95 p-3.5 shadow-2xl backdrop-blur-md">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}`;
		}

		if (mode === "range") {
			return `import { DatePicker } from "@at5/kairo";
import { useState } from "react";

export function RangeDatePicker() {
  const [range, setRange] = useState({ start: null, end: null });

  return (
    <DatePicker.Root
      mode="range"
      locale="${locale}"
      value={range}
      onValueChange={setRange}
    >
      <div className="flex flex-col gap-2 w-80">
        <DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display">
          Date range
        </DatePicker.Label>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue-600/35">
          <DatePicker.Input index={0} className="w-24 bg-transparent text-white outline-none font-mono text-[12px]" />
          <span className="text-zinc-650 font-bold text-[10px] uppercase font-display">to</span>
          <DatePicker.Input index={1} className="w-24 bg-transparent text-white outline-none font-mono text-[12px]" />
          <DatePicker.Trigger className="text-zinc-500 hover:text-white ml-auto">
            📅
          </DatePicker.Trigger>
        </div>

        <DatePicker.Content portal={true} side="bottom" align="start" sideOffset={6} className="w-[290px] rounded-xl border border-zinc-900 bg-black/95 p-3.5 shadow-2xl backdrop-blur-md">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}`;
		}

		return `import { DatePicker } from "@at5/kairo";
import { useState } from "react";

export function MultiDatePicker() {
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <DatePicker.Root
      mode="multiple"
      locale="${locale}"
      value={dates}
      onValueChange={setDates}
    >
      <div className="flex flex-col gap-2 w-72">
        <DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display">
          Multiple dates
        </DatePicker.Label>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue-600/35">
          <DatePicker.Input className="flex-1 bg-transparent text-white outline-none font-mono text-[12px]" />
          <DatePicker.Trigger className="text-zinc-500 hover:text-white">
            📅
          </DatePicker.Trigger>
        </div>

        <DatePicker.Content portal={true} side="bottom" align="start" sideOffset={6} className="w-[290px] rounded-xl border border-zinc-900 bg-black/95 p-3.5 shadow-2xl backdrop-blur-md">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}`;
	};

	const isRTL = locale === "ar";

	return (
		<div className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/20 shadow-2xl overflow-hidden backdrop-blur-xl">
			{/* Header Controls */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 bg-black/40 px-6 py-4 gap-4">
				{/* Mode Toggles */}
				<div className="flex bg-zinc-950/80 rounded-xl p-1 border border-zinc-900/60 self-start select-none">
					{(["single", "range", "multiple"] as Mode[]).map((m) => (
						<button
							key={m}
							onClick={() => {
								setMode(m);
								setActiveTab("preview");
							}}
							className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 font-display ${
								mode === m
									? "bg-blue-600 text-white shadow-md shadow-blue-600/10 animate-in fade-in duration-100"
									: "text-zinc-450 hover:text-white"
							}`}
						>
							{m}
						</button>
					))}
				</div>

				{/* Locale & View controls */}
				<div className="flex items-center gap-3">
					<select
						value={locale}
						onChange={(e) => setLocale(e.target.value as Locale)}
						className="rounded-lg border border-zinc-900 bg-zinc-950/80 px-3 py-2 text-xs font-semibold text-zinc-300 outline-none hover:border-zinc-800 focus:border-blue-500 transition-colors"
					>
						<option value="en-US">English (US)</option>
						<option value="pt-BR">Português (BR)</option>
						<option value="ar">العربية (RTL)</option>
						<option value="ja-JP">日本語 (Japan)</option>
					</select>

					<div className="flex bg-zinc-950/80 rounded-lg p-1 border border-zinc-900/60 select-none">
						<button
							onClick={() => setActiveTab("preview")}
							className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
								activeTab === "preview"
									? "bg-zinc-900 text-white"
									: "text-zinc-550 hover:text-zinc-300"
							}`}
						>
							Preview
						</button>
						<button
							onClick={() => setActiveTab("code")}
							className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
								activeTab === "code"
									? "bg-zinc-900 text-white"
									: "text-zinc-550 hover:text-zinc-300"
							}`}
						>
							Code
						</button>
					</div>
				</div>
			</div>

			{/* Main Display Pane */}
			<div className="p-8 min-h-[480px] flex items-center justify-center bg-black/10 relative">
				{activeTab === "preview" ? (
					<div className="w-full flex flex-col items-center justify-center transition-all duration-300 animate-in fade-in zoom-in-95">
						{/* Status indicator */}
						<div className="mb-6 font-mono text-[11px] text-zinc-500 select-none text-center bg-zinc-950/60 border border-zinc-900 rounded-full px-4 py-1.5">
							{mode === "single" && (
								<span>
									Value:{" "}
									<strong className="text-zinc-300">
										{singleDate
											? singleDate.toLocaleDateString(locale)
											: "null"}
									</strong>
								</span>
							)}
							{mode === "range" && (
								<span>
									Start:{" "}
									<strong className="text-zinc-300">
										{rangeDate.start
											? rangeDate.start.toLocaleDateString(locale)
											: "null"}
									</strong>{" "}
									· End:{" "}
									<strong className="text-zinc-300">
										{rangeDate.end
											? rangeDate.end.toLocaleDateString(locale)
											: "null"}
									</strong>
								</span>
							)}
							{mode === "multiple" && (
								<span>
									Selected ({multipleDates.length}):{" "}
									<strong className="text-zinc-300">
										{multipleDates.length > 0
											? multipleDates
													.map((d) => d.toLocaleDateString(locale))
													.join(", ")
											: "none"}
									</strong>
								</span>
							)}
						</div>

						{/* Rendered Live Components */}
						<div dir={isRTL ? "rtl" : "ltr"} className="relative">
							{mode === "single" && (
								<DatePicker.Root
									mode="single"
									locale={locale}
									onValueChange={(d) => setSingleDate(d as Date | null)}
									value={singleDate}
									closeOnSelect={false}
								>
									<div className="flex flex-col gap-2 w-72 text-left relative z-40">
										<DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display">
											Appointment Date
										</DatePicker.Label>
										<div className="flex w-full items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue-600/35 focus-within:border-blue-500 transition-all group">
											<DatePicker.Input className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-650 flex items-center justify-between font-mono text-[12px] tracking-tight" />
											<DatePicker.Trigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect
														width="18"
														height="18"
														x="3"
														y="4"
														rx="2"
														ry="2"
													/>
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
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="15"
														height="15"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}
														/>
													</svg>
												</DatePicker.PrevTrigger>
												<DatePicker.ViewTrigger className="h-7 px-2 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors font-display" />
												<DatePicker.NextTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="15"
														height="15"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
														/>
													</svg>
												</DatePicker.NextTrigger>
											</DatePicker.ViewControl>

											<DatePicker.View view="day">
												<DatePicker.Grid
													header={
														<DatePicker.WeekDays className="flex w-full mb-1.5 text-zinc-650 font-bold text-[10px] uppercase font-display" />
													}
													className="w-full border-collapse space-y-1"
												>
													{({ weeks }) => (
														<tbody className="flex flex-col gap-1">
															{weeks.map((week, wi) => (
																<tr
																	key={wi}
																	className="flex w-full justify-between mt-0.5"
																>
																	{week.map((day, di) => (
																		<DatePicker.Day
																			key={di}
																			date={day}
																			className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-medium text-zinc-355 hover:bg-zinc-900 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white aria-selected:hover:bg-blue-600 focus:bg-zinc-900 focus:text-white outline-none data-[outside-month=true]:text-zinc-700 data-[outside-month=true]:pointer-events-none aria-disabled:opacity-30 aria-disabled:pointer-events-none data-[today=true]:text-blue-500 data-[today=true]:font-bold transition-all duration-150"
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

							{mode === "range" && (
								<DatePicker.Root
									mode="range"
									locale={locale}
									onValueChange={(d) =>
										setRangeDate(d as { start: Date | null; end: Date | null })
									}
									value={rangeDate}
									closeOnSelect={false}
								>
									<div className="flex flex-col gap-2 w-[340px] text-left relative z-40">
										<DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display">
											Trip Range
										</DatePicker.Label>
										<div className="flex w-full items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue-600/35 focus-within:border-blue-500 transition-all group">
											<DatePicker.Input
												index={0}
												className="w-24 bg-transparent text-white outline-none font-mono text-[12px]"
											/>
											<span className="text-zinc-650 font-bold text-[10px] uppercase font-display">
												to
											</span>
											<DatePicker.Input
												index={1}
												className="w-24 bg-transparent text-white outline-none font-mono text-[12px]"
											/>
											<DatePicker.Trigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 ml-auto">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect
														width="18"
														height="18"
														x="3"
														y="4"
														rx="2"
														ry="2"
													/>
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
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="15"
														height="15"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}
														/>
													</svg>
												</DatePicker.PrevTrigger>
												<DatePicker.ViewTrigger className="h-7 px-2 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors font-display" />
												<DatePicker.NextTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="15"
														height="15"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
														/>
													</svg>
												</DatePicker.NextTrigger>
											</DatePicker.ViewControl>

											<DatePicker.View view="day">
												<DatePicker.Grid
													header={
														<DatePicker.WeekDays className="flex w-full mb-1.5 text-zinc-650 font-bold text-[10px] uppercase font-display" />
													}
													className="w-full border-collapse space-y-1"
												>
													{({ weeks }) => (
														<tbody className="flex flex-col gap-1">
															{weeks.map((week, wi) => (
																<tr
																	key={wi}
																	className="flex w-full justify-between mt-0.5"
																>
																	{week.map((day, di) => (
																		<DatePicker.Day
																			key={di}
																			date={day}
																			className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-medium text-zinc-355 hover:bg-zinc-900 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white aria-selected:hover:bg-blue-600 focus:bg-zinc-900 focus:text-white outline-none data-[outside-month=true]:text-zinc-700 data-[outside-month=true]:pointer-events-none aria-disabled:opacity-30 aria-disabled:pointer-events-none data-[today=true]:text-blue-500 data-[today=true]:font-bold data-[in-range=true]:bg-blue-900/20 data-[range-start=true]:bg-blue-600 data-[range-end=true]:bg-blue-600 data-[range-start=true]:text-white data-[range-end=true]:text-white transition-all duration-150"
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

							{mode === "multiple" && (
								<DatePicker.Root
									mode="multiple"
									locale={locale}
									onValueChange={(d) => setMultipleDates(d as Date[])}
									value={multipleDates}
									closeOnSelect={false}
								>
									<div className="flex flex-col gap-2 w-72 text-left relative z-40">
										<DatePicker.Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display">
											Multiple Dates
										</DatePicker.Label>
										<div className="flex w-full items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 px-4 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue-600/35 focus-within:border-blue-500 transition-all group">
											<DatePicker.Input className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-650 flex items-center justify-between font-mono text-[12px] tracking-tight" />
											<DatePicker.Trigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect
														width="18"
														height="18"
														x="3"
														y="4"
														rx="2"
														ry="2"
													/>
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
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="15"
														height="15"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															d={isRTL ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}
														/>
													</svg>
												</DatePicker.PrevTrigger>
												<DatePicker.ViewTrigger className="h-7 px-2 flex items-center justify-center rounded-lg text-xs font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors font-display" />
												<DatePicker.NextTrigger className="h-7 w-7 flex items-center justify-center rounded-lg bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-30">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="15"
														height="15"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															d={isRTL ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
														/>
													</svg>
												</DatePicker.NextTrigger>
											</DatePicker.ViewControl>

											<DatePicker.View view="day">
												<DatePicker.Grid
													header={
														<DatePicker.WeekDays className="flex w-full mb-1.5 text-zinc-650 font-bold text-[10px] uppercase font-display" />
													}
													className="w-full border-collapse space-y-1"
												>
													{({ weeks }) => (
														<tbody className="flex flex-col gap-1">
															{weeks.map((week, wi) => (
																<tr
																	key={wi}
																	className="flex w-full justify-between mt-0.5"
																>
																	{week.map((day, di) => (
																		<DatePicker.Day
																			key={di}
																			date={day}
																			className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-medium text-zinc-355 hover:bg-zinc-900 hover:text-white aria-selected:bg-blue-600 aria-selected:text-white aria-selected:hover:bg-blue-600 focus:bg-zinc-900 focus:text-white outline-none data-[outside-month=true]:text-zinc-700 data-[outside-month=true]:pointer-events-none aria-disabled:opacity-30 aria-disabled:pointer-events-none data-[today=true]:text-blue-500 data-[today=true]:font-bold transition-all duration-150"
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
						</div>
					</div>
				) : (
					<div className="w-full max-w-2xl bg-zinc-950 rounded-xl border border-zinc-900 p-6 relative font-mono text-[11.5px] text-zinc-300 leading-relaxed overflow-x-auto shadow-inner h-[400px] select-text">
						{/* Copy button */}
						<button
							onClick={handleCopy}
							className="absolute top-4 right-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border border-zinc-850 active:scale-95"
						>
							{copied ? "Copied! ✓" : "Copy Code"}
						</button>
						<pre className="mt-2 whitespace-pre select-text text-zinc-300">
							<code>{getCodeString()}</code>
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
