import { AnatomyDiagram, AnatomyLabel, AnatomyLeader } from "../anatomy-diagram";

export function DatePickerAnatomy() {
  return (
    <AnatomyDiagram>
      <svg
        viewBox="0 0 900 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Date Picker component anatomy"
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
          DatePicker.Root
        </AnatomyLabel>
        <AnatomyLeader d="M220 56 L220 64" />

        <rect
          x={128}
          y={88}
          width={200}
          height={28}
          fill="var(--anatomy-surface)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={2}
          rx={4}
        />
        <text x={138} y={106} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          DatePicker.Label
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
          width={480}
          height={28}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={158} y={176} fill="var(--anatomy-label)" fontSize={10}>
          DatePicker.Input (segments)
        </text>
        <rect
          x={648}
          y={158}
          width={100}
          height={28}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={658} y={176} fill="var(--anatomy-label)" fontSize={10}>
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
          DatePicker.Content (popover)
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
        <rect
          x={158}
          y={236}
          width={200}
          height={24}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={168} y={252} fill="var(--anatomy-label)" fontSize={10}>
          DatePicker.Presets (optional)
        </text>
        <text x={158} y={278} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          DatePicker.Calendar (or ViewControl + Grid + Day)
        </text>

        <AnatomyLabel x={20} y={100}>
          Label
        </AnatomyLabel>
        <AnatomyLeader d="M128 100 L80 100" />

        <AnatomyLabel x={20} y={160}>
          Input + Trigger
        </AnatomyLabel>
        <AnatomyLeader d="M128 156 L72 156" />

        <AnatomyLabel x={720} y={260}>
          Content
        </AnatomyLabel>
        <AnatomyLeader d="M748 260 L680 260" />

        <rect
          x={128}
          y={472}
          width={180}
          height={24}
          fill="var(--anatomy-surface-2)"
          stroke="var(--anatomy-stroke)"
          strokeWidth={1.5}
          rx={3}
        />
        <text x={138} y={488} fill="var(--anatomy-label)" fontSize={10}>
          DatePicker.HiddenInput
        </text>
        <AnatomyLabel x={20} y={484}>
          HiddenInput
        </AnatomyLabel>
        <AnatomyLeader d="M128 484 L72 484" />
      </svg>
    </AnatomyDiagram>
  );
}
