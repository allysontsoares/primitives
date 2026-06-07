import { ImageResponse } from "next/og";
import { KENOS_MARK, KENOS_VOID, KenosMarkSvg } from "@/lib/kenos-mark-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 40,
        }}
      >
        <KenosMarkSvg size={120} strokeWidth={3} color={KENOS_MARK} />
      </div>
    ),
    { ...size },
  );
}