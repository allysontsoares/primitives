import { AnatomyDiagram, AnatomyLabel, AnatomyLeader } from "../anatomy-diagram";

export function ComboboxAnatomy() {
  return (
    <AnatomyDiagram>
      <svg
        viewBox="0 0 900 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Combobox component anatomy"
      >
        <rect
          x="100"
          y="64"
          width="700"
          height="320"
          stroke="var(--anatomy-root-stroke)"
          strokeWidth="2.5"
          strokeDasharray="10 10"
          fill="none"
        />
        <AnatomyLabel x={108} y={50}>
          Combobox.Root
        </AnatomyLabel>
        <AnatomyLeader d="M220 56 L220 64" />

        <rect x={128} y={88} width={200} height={28} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={138} y={106} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Combobox.Label
        </text>

        <rect x={128} y={128} width={520} height={44} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={138} y={148} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Input row
        </text>
        <rect x={148} y={152} width={360} height={24} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={158} y={168} fill="var(--anatomy-label)" fontSize={10}>
          Combobox.Input (combobox)
        </text>
        <rect x={520} y={152} width={48} height={24} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={528} y={168} fill="var(--anatomy-label)" fontSize={10}>
          Trigger
        </text>
        <rect x={576} y={152} width={48} height={24} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} strokeDasharray="4 4" />
        <text x={584} y={168} fill="var(--anatomy-label)" fontSize={10}>
          Clear
        </text>

        <rect x={128} y={188} width={640} height={160} fill="var(--anatomy-inset)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={138} y={208} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          Combobox.Content (inline)
        </text>
        <rect x={148} y={220} width={600} height={88} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={4} />
        <text x={158} y={240} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Combobox.List (listbox)
        </text>
        <rect x={168} y={252} width={560} height={28} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={178} y={270} fill="var(--anatomy-label)" fontSize={10}>
          Combobox.Item (option)
        </text>
        <rect x={148} y={316} width={200} height={24} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} strokeDasharray="4 4" />
        <text x={158} y={332} fill="var(--anatomy-label)" fontSize={10}>
          Combobox.Empty
        </text>

        <AnatomyLabel x={20} y={100}>
          Label
        </AnatomyLabel>
        <AnatomyLeader d="M128 100 L80 100" />

        <AnatomyLabel x={20} y={164}>
          Input
        </AnatomyLabel>
        <AnatomyLeader d="M148 164 L80 164" />

        <AnatomyLabel x={20} y={240}>
          Content
        </AnatomyLabel>
        <AnatomyLeader d="M128 240 L80 240" />
      </svg>
    </AnatomyDiagram>
  );
}