import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  LuMap,
  LuImageOff,
  LuServerCrash,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import api from "../api";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const TOURS_ENDPOINT = "admin/tours/";
const PAGE_SIZE_FALLBACK = 10;
const SKELETON_ROW_COUNT = 8;
const SKELETON_CARD_COUNT = 5;
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const TABLE_COLUMNS = [
  "Cover",
  "Tour Title",
  "Agency",
  "Destination",
  "Category",
  "Duration",
  "Price",
  "Flight",
  "Status",
  "Created",
];

const CATEGORY_STYLES = {
  luxury: "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20",
  adventure: "bg-green-400/10 text-green-400 border-green-400/20",
  beach: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  honeymoon: "bg-pink-400/10 text-pink-400 border-pink-400/20",
  family: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  cultural: "bg-orange-400/10 text-orange-400 border-orange-400/20",
};
const DEFAULT_CATEGORY_STYLE = "bg-gray-400/10 text-gray-400 border-gray-400/20";

const STATUS_STYLES = {
  published: "bg-green-400/10 text-green-400 border-green-400/20",
  draft: "bg-orange-400/10 text-orange-400 border-orange-400/20",
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
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

function formatDuration(duration) {
  if (duration === null || duration === undefined) return "—";
  return `${duration} Day${Number(duration) === 1 ? "" : "s"}`;
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

function CoverImage({ src, alt, size = 44 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="shrink-0 rounded-xl border border-white/10 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0d1b2a] text-gray-600"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <LuImageOff className="h-4 w-4" />
    </div>
  );
}

function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] || DEFAULT_CATEGORY_STYLE;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {capitalize(category)}
    </span>
  );
}

function FlightBadge({ included }) {
  const style = included
    ? "bg-green-400/10 text-green-400 border-green-400/20"
    : "bg-gray-400/10 text-gray-400 border-gray-400/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {included ? "Included" : "Not Included"}
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

function ToursTable({ tours, isLoading }) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1b2a] shadow-sm md:block">
      <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
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
            : tours.map((tour) => (
                <tr
                  key={tour.id}
                  className="transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <CoverImage src={tour.cover_image} alt={tour.title} />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-white">
                    {tour.title}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{tour.agency}</td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {tour.city}, {tour.country}
                  </td>
                  <td className="px-5 py-3.5">
                    <CategoryBadge category={tour.category} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatDuration(tour.duration)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-300">
                    {formatPrice(tour.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <FlightBadge included={Boolean(tour.flight_included)} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={tour.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatDate(tour.created_at)}
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

function TourCards({ tours, isLoading }) {
  return (
    <div className="space-y-3 md:hidden">
      {isLoading
        ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-white/5" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-white/5" />
              </div>
            </div>
          ))
        : tours.map((tour) => (
            <div
              key={tour.id}
              className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-4 shadow-sm transition-colors duration-200 hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <CoverImage src={tour.cover_image} alt={tour.title} size={48} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {tour.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">{tour.agency}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CategoryBadge category={tour.category} />
                <FlightBadge included={Boolean(tour.flight_included)} />
                <StatusBadge status={tour.status} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-y-2 border-t border-white/5 pt-3 text-xs">
                <div>
                  <dt className="text-gray-500">Destination</dt>
                  <dd className="mt-0.5 truncate text-gray-300">
                    {tour.city}, {tour.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Duration</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatDuration(tour.duration)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Price</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatPrice(tour.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatDate(tour.created_at)}
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
        <LuMap className="h-6 w-6" />
      </div>
      <p className="text-sm text-gray-400">No tours found.</p>
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
        <p className="text-sm font-medium text-white">Couldn't load tours</p>
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

export default function ToursPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const fetchTours = useCallback((pageNumber, signal) => {
    setStatus("loading");
    setErrorMessage("");

    api
      .get(TOURS_ENDPOINT, { params: { page: pageNumber }, signal })
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
    fetchTours(page, controller.signal);
    return () => controller.abort();
  }, [page, fetchTours]);

  const handleRetry = () => fetchTours(page);

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
          <h1 className="text-2xl font-semibold tracking-tight text-white">Tours</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage all tour packages available on Wanderly.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#0d1b2a] px-3 py-1.5 text-xs font-medium text-[#d4af37]">
          <LuMap className="h-3.5 w-3.5" />
          {data.count} Tours
        </span>
      </header>

      {isError ? (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <ToursTable tours={data.results} isLoading={isLoading} />
          <TourCards tours={data.results} isLoading={isLoading} />
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