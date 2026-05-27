import type React from "react";
import { useDatePickerContext } from "./context";

export type TriggerProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"aria-haspopup" | "aria-expanded" | "aria-controls"
>;

export function Trigger({
	children,
	onClick,
	disabled,
	...props
}: TriggerProps) {
	const { state, dispatch, ids, config } = useDatePickerContext();

	const isDisabled = disabled ?? config.disabled === true;
	const isReadOnly = config.readOnly;

	return (
		<button
			type="button"
			id={ids.trigger}
			aria-haspopup="dialog"
			aria-expanded={state.open}
			aria-controls={ids.content}
			aria-label={children ? undefined : "Open date picker"}
			disabled={isDisabled || isReadOnly}
			data-disabled={isDisabled || isReadOnly ? "true" : undefined}
			onClick={(e) => {
				if (isDisabled || isReadOnly) return;
				dispatch({ type: "TOGGLE", source: "trigger" });
				onClick?.(e);
			}}
			{...props}
		>
			{children}
		</button>
	);
}
