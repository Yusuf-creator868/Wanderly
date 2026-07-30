import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  LuCalendarCheck,
  LuServerCrash,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import api from "../api";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const BOOKINGS_ENDPOINT = "admin/bookings/";
const PAGE_SIZE_FALLBACK = 10;
const SKELETON_ROW_COUNT = 8;
const SKELETON_CARD_COUNT = 5;
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const TABLE_COLUMNS = [
  "Booking ID",
  "Traveler",
  "Tour",
  "Agency",
  "Travelers",
  "Total Price",
  "Status",
  "Created",
];

const STATUS_STYLES = {
  confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  pending: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};
const DEFAULT_STATUS_STYLE = "bg-gray-400/10 text-gray-400 border-gray-400/20";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "N/A";
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function formatTravelers(count) {
  const numericCount = Number(count) || 0;
  return `${numericCount} Traveler${numericCount === 1 ? "" : "s"}`;
}

function capitalize(value) {
  if (!value || typeof value !== "string") return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isRequestCancelled(error) {
  return error?.name === "CanceledError" || error?.name === "AbortError";
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

function BookingIdBadge({ id }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300">
      #{id}
    </span>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {capitalize(status)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop / tablet table                                              */
/* ------------------------------------------------------------------ */

function BookingsTable({ bookings, isLoading }) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1b2a] shadow-sm md:block">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-gray-500">
            {TABLE_COLUMNS.map((column) => (
              <th key={column} className="px-5 py-3.5 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {isLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
                <tr key={index}>
                  {TABLE_COLUMNS.map((column) => (
                    <td key={column} className="px-5 py-3.5">
                      <div className="h-4 w-full max-w-[120px] animate-pulse rounded-md bg-white/5" />
                    </td>
                  ))}
                </tr>
              ))
            : bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <BookingIdBadge id={booking.id} />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-white">
                    {booking.user || "Unknown User"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{booking.tour}</td>
                  <td className="px-5 py-3.5 text-gray-400">{booking.agency}</td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatTravelers(booking.travelers)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-300">
                    {formatPrice(booking.total_price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatDate(booking.created_at)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile cards                                                        */
/* ------------------------------------------------------------------ */

function BookingCards({ bookings, isLoading }) {
  return (
    <div className="space-y-3 md:hidden">
      {isLoading
        ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-14 animate-pulse rounded-full bg-white/5" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-white/5" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3.5 w-1/2 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))
        : bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-4 shadow-sm transition-colors duration-200 hover:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between gap-2">
                <BookingIdBadge id={booking.id} />
                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-3">
                <p className="truncate text-sm font-medium text-white">
                  {booking.user || "Unknown User"}
                </p>
                <p className="truncate text-xs text-gray-500">{booking.tour}</p>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-y-2 border-t border-white/5 pt-3 text-xs">
                <div>
                  <dt className="text-gray-500">Agency</dt>
                  <dd className="mt-0.5 truncate text-gray-300">{booking.agency}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Travelers</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatTravelers(booking.travelers)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total Price</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatPrice(booking.total_price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatDate(booking.created_at)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

function Pagination({ page, hasPrevious, hasNext, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d1b2a] px-4 py-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
        aria-label="Go to previous page"
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-300 transition-colors duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <LuChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <span className="text-sm text-gray-400">
        Page <span className="font-medium text-white">{page}</span>
        {totalPages ? (
          <>
            {" "}
            of <span className="font-medium text-white">{totalPages}</span>
          </>
        ) : null}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        aria-label="Go to next page"
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-300 transition-colors duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <span className="hidden sm:inline">Next</span>
        <LuChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty / error states                                                */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0d1b2a] py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-500">
        <LuCalendarCheck className="h-6 w-6" />
      </div>
      <p className="text-sm text-gray-400">No bookings found.</p>
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
        <p className="text-sm font-medium text-white">Couldn't load bookings</p>
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

export default function BookinAdmingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const fetchBookings = useCallback((pageNumber, signal) => {
    setStatus("loading");
    setErrorMessage("");

    api
      .get(BOOKINGS_ENDPOINT, { params: { page: pageNumber }, signal })
      .then((response) => {
        setData(response.data);
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
    fetchBookings(page, controller.signal);
    return () => controller.abort();
  }, [page, fetchBookings]);

  const handleRetry = () => fetchBookings(page);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;
    setPage(nextPage);
  };

  const isLoading = status === "loading";
  const isError = status === "error";
  const isEmpty = status === "success" && data?.results?.length === 0;

  const pageSize = data?.results?.length || PAGE_SIZE_FALLBACK;
  const totalPages = data.count ? Math.max(1, Math.ceil(data.count / pageSize)) : null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Bookings</h1>
          <p className="mt-1 text-sm text-gray-400">
            View and monitor all bookings made on Wanderly.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#0d1b2a] px-3 py-1.5 text-xs font-medium text-[#d4af37]">
          <LuCalendarCheck className="h-3.5 w-3.5" />
          {data.count} Bookings
        </span>
      </header>

      {isError ? (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <BookingsTable bookings={data.results} isLoading={isLoading} />
          <BookingCards bookings={data.results} isLoading={isLoading} />
          <Pagination
            page={page}
            hasPrevious={Boolean(data.previous)}
            hasNext={Boolean(data.next)}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}