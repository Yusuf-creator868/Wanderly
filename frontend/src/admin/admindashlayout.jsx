import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";




export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        {/* Top padding on mobile keeps content clear of the fixed hamburger button */}
        <div className="pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}