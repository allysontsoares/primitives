import {
  KENOS_BORDER,
  KENOS_GRID,
  KENOS_MARK,
  KENOS_MUTED,
  KENOS_VOID,
  KenosMarkSvg,
} from "./kenos-mark-paths";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export function OgBrandImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: KENOS_VOID,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${KENOS_GRID} 1px, transparent 1px),
            linear-gradient(90deg, ${KENOS_GRID} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: 700,
          height: 400,
          transform: "translateX(-50%)",
          background: "rgba(250, 250, 250, 0.05)",
          filter: "blur(120px)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 168,
            height: 168,
            border: `1px solid ${KENOS_BORDER}`,
            borderRadius: 24,
            background: "rgba(24, 24, 27, 0.6)",
          }}
        >
          <KenosMarkSvg size={112} strokeWidth={3.5} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: KENOS_MARK,
              lineHeight: 1,
            }}
          >
            kenos
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: KENOS_MUTED,
              lineHeight: 1.2,
            }}
          >
            The space before design
          </div>
        </div>
      </div>
    </div>
  );
}