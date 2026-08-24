import type { ReactNode } from "react";

/** Layout base di ogni schermata: area sicura + spazio per la barra inferiore. */
export function ScreenLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+6.5rem)]">
      {children}
    </main>
  );
}
