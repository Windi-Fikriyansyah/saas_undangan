import type { CSSProperties } from "react";
import type { WeddingBlock } from "@/types/wedding";

function val(obj: any, key: string) { const v = obj?.[key]; return v == null ? undefined : String(v); }
export default function ResponsiveFrame({ block, children }: { block: WeddingBlock; children: React.ReactNode }) {
  const r = block.responsive ?? {};
  const s: CSSProperties = {
    "--r-m-padding": val(r.mobile, "padding"), "--r-t-padding": val(r.tablet, "padding"), "--r-d-padding": val(r.desktop, "padding"),
    "--r-m-min-height": val(r.mobile, "minHeight"), "--r-t-min-height": val(r.tablet, "minHeight"), "--r-d-min-height": val(r.desktop, "minHeight"),
    "--r-m-gap": val(r.mobile, "gap"), "--r-t-gap": val(r.tablet, "gap"), "--r-d-gap": val(r.desktop, "gap"),
    "--r-m-max-width": val(r.mobile, "maxWidth"), "--r-t-max-width": val(r.tablet, "maxWidth"), "--r-d-max-width": val(r.desktop, "maxWidth")
  } as CSSProperties;
  return <div className="responsive-frame" style={s}>{children}</div>;
}
