import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-card border-r border-border p-4 flex flex-col">

      {/* Logo / Brand */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
          A
        </div>
        <div>
          <div className="font-semibold">Aurelia Bank</div>
          <div className="text-xs text-muted-foreground">
            Retail Ops Console
          </div>
        </div>
      </div>

      {/* Navigation */}
        <nav className="flex-1 space-y-1 text-sm">
        <NavItem to="/" label="Dashboard" icon="🏠" />
        <NavItem to="/accounts" label="Accounts" icon="💳" />
        <NavItem to="/transfers" label="Transfers" icon="🔁" />
        <NavItem to="/loans" label="Loans" icon="🏦" />
        <NavItem to="/statements" label="Statements" icon="📄" />
      </nav>


      {/* Quick Tip */}
      <div className="mt-6 rounded-xl border border-border bg-background p-4 text-sm">
        <div className="font-semibold mb-1">Quick tip</div>
        <p className="text-muted-foreground">
          Use filters on Statements to produce audit-friendly views.
        </p>
      </div>

    </aside>
  );
}

/* Small helper inside same file (still beginner-friendly) */
function NavItem({
  to,
  icon,
  label
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted",
        ].join(" ")
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
}
