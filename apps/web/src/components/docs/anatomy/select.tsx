import { AnatomyDiagram, AnatomyLabel, AnatomyLeader } from "../anatomy-diagram";

export function SelectAnatomy() {
  return (
    <AnatomyDiagram>
      <svg
        viewBox="0 0 900 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Select component anatomy"
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
          Select.Root
        </AnatomyLabel>
        <AnatomyLeader d="M220 56 L220 64" />

        <rect x={128} y={88} width={200} height={28} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={138} y={106} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Select.Label
        </text>

        <rect x={128} y={128} width={640} height={44} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={138} y={148} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Select.Trigger (combobox)
        </text>
        <rect x={148} y={152} width={400} height={24} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={158} y={168} fill="var(--anatomy-label)" fontSize={10}>
          Select.Value + Select.Icon
        </text>

        <rect x={128} y={188} width={640} height={160} fill="var(--anatomy-inset)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={138} y={208} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          Select.Content (inline default)
        </text>
        <rect x={148} y={220} width={600} height={116} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={4} />
        <text x={158} y={240} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Select.List (listbox)
        </text>
        <rect x={168} y={252} width={560} height={28} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={178} y={270} fill="var(--anatomy-label)" fontSize={10}>
          Select.Item (option)
        </text>

        <rect x={128} y={360} width={280} height={24} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} strokeDasharray="4 4" />
        <text x={138} y={376} fill="var(--anatomy-label)" fontSize={10}>
          Select.HiddenSelect (forms)
        </text>

        <AnatomyLabel x={20} y={100}>
          Label
        </AnatomyLabel>
        <AnatomyLeader d="M128 100 L80 100" />

        <AnatomyLabel x={20} y={150}>
          Trigger
        </AnatomyLabel>
        <AnatomyLeader d="M128 150 L80 150" />

        <AnatomyLabel x={20} y={240}>
          Content
        </AnatomyLabel>
        <AnatomyLeader d="M128 240 L80 240" />
      </svg>
    </AnatomyDiagram>
  );
}