import { Link } from "@tanstack/react-router";
import { Cloud, Compass, Heart, Settings, User } from "lucide-react";

/** Barra di navigazione inferiore con 5 pulsanti (icone provvisorie). */
const items = [
  { to: "/schermata-1", icon: Compass, label: "Schermata 1" },
  { to: "/schermata-2", icon: Heart, label: "Schermata 2" },
  { to: "/", icon: Cloud, label: "Home", center: true },
  { to: "/schermata-3", icon: User, label: "Schermata 3" },
  { to: "/schermata-4", icon: Settings, label: "Schermata 4" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <ul className="glass mx-auto flex max-w-md items-center justify-between gap-1 rounded-3xl px-3 py-2">
        {items.map(({ to, icon: Icon, label, ...rest }) => {
          const center = "center" in rest && rest.center;
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                aria-label={label}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="flex flex-col items-center justify-center rounded-2xl py-2 transition-colors"
              >
                {center ? (
                  <span className="glass-center -mt-6 grid size-14 place-items-center rounded-full">
                    <Icon className="size-7 text-primary" strokeWidth={1.75} />
                  </span>
                ) : (
                  <Icon className="size-6" strokeWidth={1.75} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
