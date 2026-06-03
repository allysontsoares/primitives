import { AnatomyDiagram, AnatomyLabel, AnatomyLeader } from "../anatomy-diagram";

export function CalendarAnatomy() {
  return (
    <AnatomyDiagram>
      <svg
        viewBox="0 0 900 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Calendar component anatomy"
      >
        <rect
          x="120"
          y="72"
          width="660"
          height="336"
          stroke="var(--anatomy-root-stroke)"
          strokeWidth="2.5"
          strokeDasharray="10 10"
          fill="none"
        />
        <AnatomyLabel x={128} y={58}>
          DatePicker.Root (for calendar state)
        </AnatomyLabel>
        <AnatomyLeader d="M248 64 L248 72" />

        <rect
          x="148"
          y="96"
          width="604"
          height="56"
          fill="var(--anatomy-surface)"
          stroke="var(--anatomy-stroke)"
          strokeWidth="2"
          rx="4"
        />
        <text x={168} y={128} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          ViewControl
        </text>
        <rect x={168} y={138} width={72} height={28} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth="1.5" rx="3" />
        <text x={178} y={156} fill="var(--anatomy-label)" fontSize={11}>
          PrevTrigger
        </text>
        <rect x={320} y={138} width={160} height={28} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth="1.5" rx="3" />
        <text x={368} y={156} fill="var(--anatomy-label)" fontSize={11}>
          ViewTrigger
        </text>
        <rect x={560} y={138} width={72} height={28} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth="1.5" rx="3" />
        <text x={572} y={156} fill="var(--anatomy-label)" fontSize={11}>
          NextTrigger
        </text>

        <rect
          x="148"
          y="168"
          width="604"
          height="220"
          fill="var(--anatomy-surface)"
          stroke="var(--anatomy-stroke)"
          strokeWidth="2"
          rx="4"
        />
        <text x={168} y={192} fill="var(--anatomy-label)" fontSize={12} fontWeight={600}>
          View (day) + Grid
        </text>

        <rect x={168} y={204} width={564} height={32} fill="var(--anatomy-surface-2)" stroke="var(--anatomy-stroke)" strokeWidth="1.5" rx="3" />
        <text x={178} y={224} fill="var(--anatomy-label)" fontSize={11}>
          WeekDays (header)
        </text>

        <rect x={168} y={248} width={564} height={124} fill="var(--anatomy-inset)" stroke="var(--anatomy-stroke)" strokeWidth="1.5" rx="3" />
        <text x={178} y={268} fill="var(--anatomy-label)" fontSize={11} fontWeight={600}>
          Grid rows + Day (td gridcell)
        </text>

        <rect x={188} y={288} width={120} height={64} fill="var(--anatomy-surface)" stroke="var(--anatomy-stroke)" strokeWidth="1.5" rx="3" />
        <text x={198} y={308} fill="var(--anatomy-label)" fontSize={10}>
          Day (data-selected etc.)
        </text>

        <AnatomyLabel x={24} y={128}>
          ViewControl
        </AnatomyLabel>
        <AnatomyLeader d="M148 124 L120 124" />

        <AnatomyLabel x={24} y={268}>
          Grid + Day
        </AnatomyLabel>
        <AnatomyLeader d="M168 268 L100 268" />

        <AnatomyLabel x={720} y={328}>
          Day (the cell)
        </AnatomyLabel>
        <AnatomyLeader d="M308 328 L700 328" />
      </svg>
    </AnatomyDiagram>
  );
}