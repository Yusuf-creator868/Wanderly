import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { LuUsers, LuBuilding2, LuMap, LuCalendarCheck, LuServerCrash } from "react-icons/lu";
import api from "../api";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const DASHBOARD_ENDPOINT = "admin/dashboard/";
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const STAT_CARDS = [
  {
    key: "users",
    label: "Total Users",
    description: "Registered Travelers & Admins",
    icon: LuUsers,
  },
  {
    key: "agencies",
    label: "Total Agencies",
    description: "Verified & Registered Agencies",
    icon: LuBuilding2,
  },
  {
    key: "tours",
    label: "Total Tours",
    description: "Available Tour Packages",
    icon: LuMap,
  },
  {
    key: "bookings",
    label: "Total Bookings",
    description: "Bookings Across All Tours",
    icon: LuCalendarCheck,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatNumber(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "0";
  return numericValue.toLocaleString("en-US");
}

function isRequestCancelled(error) {
  return error?.name === "CanceledError" || error?.name === "AbortError";
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#0d1b2a] p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.03] hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37] transition-transform duration-300 ease-out group-hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">
      <div className="h-11 w-11 animate-pulse rounded-xl bg-white/5" />
      <div className="mt-5 h-3.5 w-2/3 animate-pulse rounded bg-white/5" />
      <div className="mt-3 h-7 w-1/2 animate-pulse rounded bg-white/5" />
      <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-white/5" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0d1b2a] py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-400">
        <LuServerCrash className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">Couldn't load dashboard data</p>
        <p className="mt-1 text-xs text-gray-500">
          {message || DEFAULT_ERROR_MESSAGE}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-sm font-medium text-[#d4af37] transition-colors duration-200 hover:bg-[#d4af37]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60"
      >
        Retry
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminDashboardPage() {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    agencies: 0,
    tours: 0,
    bookings: 0,
  });

  const fetchStats = useCallback((signal) => {
    setStatus("loading");
    setErrorMessage("");

    api
      .get(DASHBOARD_ENDPOINT, { signal })
      .then((response) => {
        setStats(response.data);
        setStatus("success");
      })
      .catch((error) => {
        if (isRequestCancelled(error)) return;
        setErrorMessage(error?.response?.data?.detail || DEFAULT_ERROR_MESSAGE);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [fetchStats]);

  const handleRetry = () => fetchStats();

  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back! Here's an overview of your Wanderly marketplace.
        </p>
      </header>

      {isError ? (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? STAT_CARDS.map((card) => <StatCardSkeleton key={card.key} />)
            : STAT_CARDS.map((card) => (
                <StatCard
                  key={card.key}
                  icon={card.icon}
                  label={card.label}
                  value={formatNumber(stats[card.key])}
                  description={card.description}
                />
              ))}
        </div>
      )}
    </div>
  );
}