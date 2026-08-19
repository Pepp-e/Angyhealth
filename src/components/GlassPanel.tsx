import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Contenitore riutilizzabile con effetto Liquid Glass. */
export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass rounded-3xl", className)}>{children}</div>;
}
