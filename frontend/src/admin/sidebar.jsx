import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuUsers, LuBuilding2,  LuMap, LuCalendarCheck, LuPlaneTakeoff, LuLogOut, LuMenu, LuX, } from "react-icons/lu";
import { Compass } from 'lucide-react'
/**
 * Sidebar navigation config.
 * Add / remove / reorder entries here — the component maps over this
 * array, so no JSX needs to change to extend the nav.
 */
const NAV_ITEMS = [
  { label: "Dashboard", path: "/adminlayout/dashboard", icon: LuLayoutDashboard },
  { label: "Users", path: "/adminlayout/users", icon: LuUsers },
  { label: "Agencies", path: "/adminlayout/agencies", icon: LuBuilding2 },
  { label: "Tours", path: "/adminlayout/tours", icon: LuMap },
  { label: "Bookings", path: "/adminlayout/bookings", icon: LuCalendarCheck },
];

// Swap for real session data / auth context.
const ADMIN = {
  name: "Yusuf",
  email: "admin@wanderly.com",
  initial: "Y",
};

// Label visibility: full text on mobile drawer + desktop (lg+),
// hidden (icon-only) on tablet (md).
const LABEL_VISIBILITY = "block md:hidden lg:block";

export default function Sidebar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = useCallback(() => setIsOpen(false), []);

  // Close the mobile drawer on Escape for keyboard users.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile hamburger trigger — hidden at md+ where the sidebar is always visible */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="wanderly-sidebar"
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d1b2a] text-gray-300 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 md:hidden"
      >
        <LuMenu className="h-5 w-5" />
      </button>

      {/* Overlay — mobile only, closes the drawer on outside click */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="wanderly-sidebar"
        aria-label="Super admin sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-white/10 bg-[#050816] transition-transform duration-300 ease-in-out md:sticky md:top-0 md:w-20 md:translate-x-0 lg:w-[280px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <button
          type="button"
          onClick={closeDrawer}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 md:hidden"
        >
          <LuX className="h-4 w-4" />
        </button>

        {/* Branding */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6 md:justify-center lg:justify-start">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
          <div className={LABEL_VISIBILITY}>
            <p className="text-[15px] font-semibold leading-tight tracking-wide text-white">
              Wanderly
            </p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Primary"
          className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
        >
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              aria-label={label}
              title={label}
              onClick={closeDrawer}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 md:justify-center lg:justify-start ${
                  isActive
                    ? "bg-white/[0.06] font-medium text-[#d4af37]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Gold active indicator */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#d4af37] transition-all duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 ${
                      isActive ? "text-[#d4af37]" : ""
                    }`}
                  />
                  <span className={LABEL_VISIBILITY}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer: admin profile + logout */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 px-1 py-1 md:justify-center lg:justify-start">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0d1b2a] text-sm font-medium text-[#d4af37]"
              aria-hidden="true"
            >
              {ADMIN.initial}
            </div>
            <div className={`min-w-0 ${LABEL_VISIBILITY}`}>
              <p className="truncate text-sm font-medium text-white">
                {ADMIN.name}
              </p>
              <p className="truncate text-xs text-gray-500">{ADMIN.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="group mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-all duration-200 ease-out hover:bg-white/[0.05] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 md:justify-center lg:justify-start"
          >
            <LuLogOut className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            <span className={LABEL_VISIBILITY}>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}