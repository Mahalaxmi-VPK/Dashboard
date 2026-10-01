import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Activity,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Alerts",
    icon: ShieldAlert,
    path: "/alerts",
  },
  {
    name: "Users",
    icon: Users,
    path: "/users",
  },
  {
    name: "Activity",
    icon: Activity,
    path: "/activity",
  },
  {
    name: "Reports",
    icon: FileText,
    path: "/reports",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-cyan-400">
          DB Guardian
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Security Dashboard
        </p>
      </div>

      <nav className="px-4 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-cyan-500 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-cyan-300"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}