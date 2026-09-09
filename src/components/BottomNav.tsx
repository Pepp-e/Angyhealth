import { Link, useRouterState } from "@tanstack/react-router";
import { Cloud, Compass, Heart, Settings, User } from "lucide-react";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

/** Barra di navigazione inferiore con 5 pulsanti (icone provvisorie). */
const items = [
  { to: "/schermata-5", icon: Compass, label: "Schermata 5" },
  { to: "/schermata-2", icon: Heart, label: "Schermata 2" },
  { to: "/", icon: Cloud, label: "Schermata principale", center: true },
  { to: "/schermata-4", icon: User, label: "Schermata 4" },
  { to: "/schermata-6", icon: Settings, label: "Schermata 6" },
] as const;


export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <ul className="glass mx-auto flex max-w-md items-center justify-between gap-1 rounded-3xl px-3 py-2">
        {items.map(({ to, icon: Icon, label, ...rest }) => {
          const center = "center" in rest && rest.center;
          const active = pathname === to;
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                aria-label={t(label)}
                aria-current={active ? "page" : undefined}
                onClick={() => vibrate(10)}
                activeOptions={{ exact: true }}
                className={`flex flex-col items-center justify-center rounded-2xl py-2 transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {center ? (
                  <span className="glass-center -mt-6 grid size-14 place-items-center rounded-full">
                    <Icon className="size-7 text-primary" strokeWidth={1.75} />
                  </span>
                ) : (
                  <Icon className="size-6" strokeWidth={1.75} />
                )}
                <span
                  className={`mt-1 block size-1.5 rounded-full bg-white shadow-[0_1px_4px_rgba(30,80,140,0.35)] transition-all duration-300 ease-out ${
                    active ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
