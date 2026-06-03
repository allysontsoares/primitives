import { AnatomyDiagram, AnatomyLabel, AnatomyLeader } from "../anatomy-diagram";

export function DateFieldAnatomy() {
  return (
    <AnatomyDiagram>
      <svg
        viewBox="0 0 900 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Date Field component anatomy"
      >
        <rect
          x="120"
          y="72"
          width="660"
          height="240"
          stroke="var(--anatomy-root-stroke)"
          strokeWidth="2.5"
          strokeDasharray="10 10"
          fill="none"
        />
        <AnatomyLabel x={128} y={58}>
          DatePicker.Root (minimal, for field)
        </AnatomyLabel>
        <AnatomyLeader d="M248 64 L248 72" />

        <rect x={148} y={96} width={240} height={32} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={158} y={116} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Label
        </text>

        <rect x={148} y={144} width={600} height={72} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth={2} rx={4} />
        <text x={158} y={164} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          DatePicker.Input
        </text>
        <rect x={168} y={176} width={80} height={32} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={176} y={196} fill="var(--anatomy-label)" fontSize={10}>
          Segment (month)
        </text>
        <rect x={260} y={176} width={24} height={32} fill="var(--anatomy-inset)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={264} y={196} fill="var(--anatomy-label)" fontSize={10}>
          /
        </text>
        <rect x={296} y={176} width={80} height={32} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={304} y={196} fill="var(--anatomy-label)" fontSize={10}>
          Segment (day)
        </text>
        <rect x={388} y={176} width={24} height={32} fill="var(--anatomy-inset)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={392} y={196} fill="var(--anatomy-label)" fontSize={10}>
          /
        </text>
        <rect x={424} y={176} width={100} height={32} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth={1.5} rx={3} />
        <text x={432} y={196} fill="var(--anatomy-label)" fontSize={10}>
          Segment (year)
        </text>

        <AnatomyLabel x={24} y={116}>
          Label
        </AnatomyLabel>
        <AnatomyLeader d="M148 112 L100 112" />

        <AnatomyLabel x={24} y={196}>
          Input segments
        </AnatomyLabel>
        <AnatomyLeader d="M168 192 L108 192" />

        <AnatomyLabel x={680} y={196}>
          (separators inside Input)
        </AnatomyLabel>
        <AnatomyLeader d="M260 192 L640 192" />
      </svg>
    </AnatomyDiagram>
  );
}