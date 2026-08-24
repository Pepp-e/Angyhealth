import { BackButton } from "@/components/BackButton";

/**
 * Header delle schermate: freccia indietro in alto a sinistra e titolo
 * matematicamente centrato rispetto alla larghezza dello schermo.
 */
export function ScreenHeader({
  title,
  back = true,
}: {
  title: string;
  back?: boolean;
}) {
  return (
    <div className="relative mb-3 flex w-full items-center justify-center">
      {back && (
        <div className="absolute left-0 top-0">
          <BackButton />
        </div>
      )}
      <h1 className="w-full px-14 text-center text-2xl font-bold leading-tight tracking-tight text-balance text-foreground">
        {title}
      </h1>
    </div>
  );
}
