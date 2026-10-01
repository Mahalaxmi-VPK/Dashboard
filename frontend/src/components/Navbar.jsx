import SearchBar from "./SearchBar";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">

      <div className="flex justify-between items-center px-8 py-5">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Database Security Dashboard
          </h1>

          <p className="text-slate-400 mt-1">
            Monitor SQL Server securely
          </p>

        </div>

        <div className="flex items-center gap-6">
          <NotificationDropdown />

        </div>

      </div>

    </header>
  );
}