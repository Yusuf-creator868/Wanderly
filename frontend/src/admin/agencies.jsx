import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  LuBuilding2,
  LuServerCrash,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuCheck,
  LuImageOff,
  LuLoaderCircle,
} from "react-icons/lu";
import api, { MAIN_URL } from "../api";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const AGENCIES_ENDPOINT = "admin/agencies/";
const PAGE_SIZE_FALLBACK = 10;
const SKELETON_ROW_COUNT = 8;
const SKELETON_CARD_COUNT = 5;
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const TABLE_COLUMNS = [
  "Logo",
  "Agency Name",
  "Owner",
  "Email",
  "Phone",
  "Country",
  "Verification",
  "Published",
  "Total Tours",
  "Joined",
];

const VERIFICATION_STYLES = {
  verified: "bg-green-400/10 text-green-400 border-green-400/20",
  pending: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};
const DEFAULT_VERIFICATION_STYLE = "bg-gray-400/10 text-gray-400 border-gray-400/20";

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

function getInitial(name) {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase();
}

function isRequestCancelled(error) {
  return error?.name === "CanceledError" || error?.name === "AbortError";
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

function AgencyLogo({ name, logoUrl, size = 36 }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="shrink-0 rounded-xl border border-white/10 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0d1b2a] text-sm font-medium text-[#d4af37]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {getInitial(name)}
    </div>
  );
}

function VerificationBadge({ status }) {
  const style = VERIFICATION_STYLES[status] || DEFAULT_VERIFICATION_STYLE;
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

function PublishedBadge({ isPublished }) {
  const style = isPublished
    ? "bg-green-400/10 text-green-400 border-green-400/20"
    : "bg-gray-400/10 text-gray-400 border-gray-400/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop / tablet table                                              */
/* ------------------------------------------------------------------ */

function AgenciesTable({ agencies, isLoading, onRowClick }) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1b2a] shadow-sm md:block">
      <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
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
            : agencies?.map((agency) => (
                <tr
                  key={agency.id}
                  onClick={() => onRowClick(agency)}
                  className="cursor-pointer transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <AgencyLogo name={agency.agency_name} logoUrl={agency.logo} />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-white">
                    {agency.agency_name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{agency.owner}</td>
                  <td className="px-5 py-3.5 text-gray-400">{agency.email}</td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {agency.phone || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{agency.country}</td>
                  <td className="px-5 py-3.5">
                    <VerificationBadge status={agency.verification_status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PublishedBadge isPublished={agency.published} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {agency.total_tours ?? 0} Tours
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatDate(agency.created_at)}
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

function AgencyCards({ agencies, isLoading, onCardClick }) {
  return (
    <div className="space-y-3 md:hidden">
      {isLoading
        ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/2 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-white/5" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-white/5" />
              </div>
            </div>
          ))
        : agencies?.map((agency) => (
            <div
              key={agency.id}
              onClick={() => onCardClick(agency)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-[#0d1b2a] p-4 shadow-sm transition-colors duration-200 hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <AgencyLogo name={agency.agency_name} logoUrl={agency.logo} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {agency.agency_name}
                  </p>
                  <p className="truncate text-xs text-gray-500">{agency.owner}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <VerificationBadge status={agency.verification_status} />
                <PublishedBadge isPublished={agency.published} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-y-2 border-t border-white/5 pt-3 text-xs">
                <div>
                  <dt className="text-gray-500">Country</dt>
                  <dd className="mt-0.5 text-gray-300">{agency.country || "—"}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total Tours</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {agency.total_tours ?? 0} Tours
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="mt-0.5 truncate text-gray-300">{agency.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Joined</dt>
                  <dd className="mt-0.5 text-gray-300">
                    {formatDate(agency.created_at)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agency detail modal                                                 */
/* ------------------------------------------------------------------ */

function AgencyDetailModal({ agency, onClose, onStatusChange }) {
  const [updating, setUpdating] = useState(null); // "verified" | "rejected" | null

  if (!agency) return null;

  const documents = agency.verification_documents || [];

  const handleDecision = async (nextStatus) => {
    setUpdating(nextStatus);
    try {
      const res = await api.patch(`admin/agencies/${agency.id}/verification/`, {
        verification_status: nextStatus,
      });
      onStatusChange(agency.id, res.data.verification_status);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b2a] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <AgencyLogo name={agency.agency_name} logoUrl={agency.logo} size={44} />
            <div>
              <h2 className="text-base font-semibold text-white">{agency.agency_name}</h2>
              <p className="text-xs text-gray-500">{agency.owner}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-500 transition-colors duration-200 hover:bg-white/5 hover:text-white"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <VerificationBadge status={agency.verification_status} />
            <PublishedBadge isPublished={agency.published} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-gray-500">Email</dt>
              <dd className="mt-0.5 truncate text-gray-200">{agency.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Phone</dt>
              <dd className="mt-0.5 text-gray-200">{agency.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Country</dt>
              <dd className="mt-0.5 text-gray-200">{agency.country || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Total Tours</dt>
              <dd className="mt-0.5 text-gray-200">{agency.total_tours ?? 0} Tours</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Joined</dt>
              <dd className="mt-0.5 text-gray-200">{formatDate(agency.created_at)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-white">Verification documents</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Licenses or certificates submitted by the agency
            </p>

            {documents.length === 0 ? (
              <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-10 text-center">
                <LuImageOff className="h-6 w-6 text-gray-600" />
                <p className="text-xs text-gray-500">No documents submitted.</p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`${MAIN_URL}${doc.document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/20"
                  >
                    <img
                      src={`${MAIN_URL}${doc.document}`}
                      alt="Verification document"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={() => handleDecision("rejected")}
            disabled={updating !== null || agency.verification_status === "rejected"}
            className="flex items-center gap-1.5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors duration-200 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updating === "rejected" ? (
              <LuLoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LuX className="h-4 w-4" />
            )}
            Reject
          </button>
          <button
            onClick={() => handleDecision("verified")}
            disabled={updating !== null || agency.verification_status === "verified"}
            className="flex items-center gap-1.5 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-400 transition-colors duration-200 hover:bg-green-400/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updating === "verified" ? (
              <LuLoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LuCheck className="h-4 w-4" />
            )}
            Verify
          </button>
        </div>
      </div>
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
        <LuBuilding2 className="h-6 w-6" />
      </div>
      <p className="text-sm text-gray-400">No agencies found.</p>
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
        <p className="text-sm font-medium text-white">Couldn't load agencies</p>
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

export default function AgenciesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [selectedAgency, setSelectedAgency] = useState(null);

  const fetchAgencies = useCallback((pageNumber, signal) => {
    setStatus("loading");
    setErrorMessage("");

    api
      .get(AGENCIES_ENDPOINT, { params: { page: pageNumber }, signal })
      .then((response) => {
        setData(response.data);
        console.log(response.data)
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
    fetchAgencies(page, controller.signal);
    return () => controller.abort();
  }, [page, fetchAgencies]);

  const handleRetry = () => fetchAgencies(page);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;
    setPage(nextPage);
  };

  // Update the row/card in place and keep the modal's copy in sync
  const handleStatusChange = (agencyId, newStatus) => {
    setData((prev) => ({
      ...prev,
      results: prev.results.map((a) =>
        a.id === agencyId ? { ...a, verification_status: newStatus } : a
      ),
    }));
    setSelectedAgency((prev) =>
      prev && prev.id === agencyId ? { ...prev, verification_status: newStatus } : prev
    );
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
          <h1 className="text-2xl font-semibold tracking-tight text-white">Agencies</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage all travel agencies registered on Wanderly.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#0d1b2a] px-3 py-1.5 text-xs font-medium text-[#d4af37]">
          <LuBuilding2 className="h-3.5 w-3.5" />
          {data.count} Agencies
        </span>
      </header>

      {isError ? (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <AgenciesTable
            agencies={data.results}
            isLoading={isLoading}
            onRowClick={setSelectedAgency}
          />
          <AgencyCards
            agencies={data.results}
            isLoading={isLoading}
            onCardClick={setSelectedAgency}
          />
          <Pagination
            page={page}
            hasPrevious={Boolean(data.previous)}
            hasNext={Boolean(data.next)}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <AgencyDetailModal
        agency={selectedAgency}
        onClose={() => setSelectedAgency(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}