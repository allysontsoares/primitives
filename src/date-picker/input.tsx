import React, { useEffect, useMemo, useRef, useState } from "react";
import { type DateType, useTimescape } from "timescape/react";
import { isDateDisabled } from "../utils/date";
import { getSegmentInfo } from "../utils/locale";
import { useDatePickerContext } from "./context";

const DEFAULT_LABELS = { month: "Month", day: "Day", year: "Year" };
const FIELD_MAP = {
	year: "years" as const,
	month: "months" as const,
	day: "days" as const,
};

export interface InputProps {
	index?: 0 | 1;
	segmentLabels?: { month?: string; day?: string; year?: string };
	className?: string;
	style?: React.CSSProperties;
}

export function Input({ index, segmentLabels, className, style }: InputProps) {
	const { state, dispatch, ids, config } = useDatePickerContext();

	const { order: segmentOrder, separator } = useMemo(
		() => getSegmentInfo(config.locale),
		[config.locale],
	);

	const labels = {
		month: segmentLabels?.month ?? DEFAULT_LABELS.month,
		day: segmentLabels?.day ?? DEFAULT_LABELS.day,
		year: segmentLabels?.year ?? DEFAULT_LABELS.year,
	};

	const sourceDate =
		index === 1
			? state.rangeEnd
			: index === 0
				? state.rangeStart
				: state.selectedDate;

	const sourceDateRef = useRef(sourceDate);
	useEffect(() => {
		sourceDateRef.current = sourceDate;
	}, [sourceDate]);

	const baseOptions: any = {
		wrapAround: true,
		onChangeDate: (nextDate: Date | undefined) => {
			if (!nextDate) return;
			if (isDateDisabled(nextDate, config)) return;

			const prevDate = sourceDateRef.current;
			if (prevDate && prevDate.getTime() === nextDate.getTime()) return;

			dispatch({ type: "FOCUS_DATE", date: nextDate });
			if (config.mode === "single") {
				dispatch({ type: "SELECT_DATE", date: nextDate });
			} else if (config.mode === "range" && index === 0) {
				dispatch({ type: "ANCHOR_DATE", date: nextDate });
			} else if (config.mode === "range" && index === 1) {
				dispatch({ type: "EXTEND_RANGE", date: nextDate });
			} else if (config.mode === "multiple") {
				dispatch({ type: "TOGGLE_DATE", date: nextDate });
			}
		},
	};
	
	if (config.minDate) baseOptions.minDate = config.minDate;
	if (config.maxDate) baseOptions.maxDate = config.maxDate;
	if (sourceDate) baseOptions.date = sourceDate;

	const { getRootProps, getInputProps, options, update } = useTimescape(baseOptions);

	// Keep timescape in sync when sourceDate changes externally
	useEffect(() => {
		update((prev: any) => {
			const next = { ...prev };
			if (sourceDate) {
				next.date = sourceDate;
			} else {
				delete next.date;
			}
			return next;
		});
	}, [sourceDate, update]);

	// Track focused segment to replicate `focused` state / `openSource`
	const [focused, setFocused] = useState<string | null>(null);

	function handleSegmentFocus(field: string) {
		setFocused(field);
		if (!state.open) dispatch({ type: "OPEN", source: "input" });
	}

	function handleSegmentBlur(
		field: string,
		e: React.FocusEvent<HTMLInputElement>,
	) {
		const relatedTarget = e.relatedTarget as Node | null;
		const isMovingWithin =
			e.currentTarget.parentElement?.contains(relatedTarget);
		if (!isMovingWithin) setFocused(null);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (config.readOnly) {
			e.preventDefault();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault();
			if (state.open) dispatch({ type: "CLOSE" });
		}
	}

	return (
		<div
			role="group"
			id={ids.input}
			aria-labelledby={ids.label}
			tabIndex={-1}
			className={className}
			style={style}
			{...getRootProps()}
			{...(config.readOnly ? { "data-disabled": "true" } : {})}
		>
			{segmentOrder.map((field, i) => {
				const type = FIELD_MAP[field as keyof typeof FIELD_MAP];
				const isFocused = focused === field;
				const isTabStop = isFocused || (focused === null && i === 0);

				return (
					<React.Fragment key={field}>
						{i > 0 && (
							<span aria-hidden="true" data-separator="true">
								{separator}
							</span>
						)}
						<input
							{...getInputProps(type)}
							aria-label={labels[field as keyof typeof labels]}
							data-segment={field}
							tabIndex={isTabStop ? 0 : -1}
							readOnly={config.readOnly}
							onFocus={(e) => {
								getInputProps(type).ref(e.currentTarget);
								handleSegmentFocus(field);
							}}
							onBlur={(e) => handleSegmentBlur(field, e)}
							onKeyDown={handleKeyDown}
							className="timescape-input"
							style={{
								width: field === "year" ? "4ch" : "2ch",
								border: "none",
								background: "transparent",
								padding: 0,
								margin: 0,
								textAlign: "center",
								font: "inherit",
								outline: "none",
							}}
						/>
					</React.Fragment>
				);
			})}
		</div>
	);
}