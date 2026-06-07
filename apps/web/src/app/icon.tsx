import { ImageResponse } from "next/og";
import { KENOS_MARK, KENOS_VOID, KenosMarkSvg } from "@/lib/kenos-mark-paths";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Bold-stroke favicon — legible at 16×16 via thicker stroke on 32px canvas */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: KENOS_VOID,
        }}
      >
        <KenosMarkSvg size={22} strokeWidth={3.5} color={KENOS_MARK} />
      </div>
    ),
    { ...size },
  );
}