import { AnatomyDiagram, AnatomyLabel, AnatomyLeader } from "../anatomy-diagram";

export function DateRangePickerAnatomy() {
  return (
    <AnatomyDiagram>
      <svg
        viewBox="0 0 900 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Date Range Picker component anatomy"
      >
        <rect
          x="100"
          y="64"
          width="700"
          height="420"
          stroke="var(--anatomy-root-stroke)"
          strokeWidth="2.5"
          strokeDasharray="10 10"
          fill="none"
        />
        <AnatomyLabel x={108} y={50}>
          DatePicker.Root (mode="range")
        </AnatomyLabel>
        <AnatomyLeader d="M240 56 L240 64" />

        <rect
          x={128}
          y={88}
          width={220}
          height={28}
          fill="var(--anatomy-surface)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={2}
          rx={4}
        />
        <text x={138} y={106} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Label
        </text>

        <rect
          x={128}
          y={128}
          width={640}
          height={56}
          fill="var(--anatomy-surface)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={2}
          rx={4}
        />
        <text x={138} y={148} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          (flex row)
        </text>
        <rect
          x={148}
          y={158}
          width={200}
          height={28}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={158} y={176} fill="var(--anatomy-label)" fontSize={10}>
          Input index=0
        </text>
        <rect
          x={368}
          y={158}
          width={200}
          height={28}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={378} y={176} fill="var(--anatomy-label)" fontSize={10}>
          Input index=1
        </text>
        <rect
          x={588}
          y={158}
          width={160}
          height={28}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={598} y={176} fill="var(--anatomy-label)" fontSize={10}>
          Trigger
        </text>

        <rect
          x={128}
          y={200}
          width={640}
          height={260}
          fill="var(--anatomy-inset)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={2}
          rx={4}
        />
        <text x={138} y={220} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          DatePicker.Content
        </text>
        <rect
          x={148}
          y={232}
          width={600}
          height={216}
          fill="var(--anatomy-surface)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={4}
        />
        <text x={158} y={252} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Calendar (range mode)
        </text>

        <AnatomyLabel x={16} y={176}>
          Inputs (index 0/1)
        </AnatomyLabel>
        <AnatomyLeader d="M148 172 L100 172" />
      </svg>
    </AnatomyDiagram>
  );
}
