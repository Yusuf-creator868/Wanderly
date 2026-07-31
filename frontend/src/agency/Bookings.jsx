import { useEffect, useState } from "react"
import {
    Search, Check, X, Clock3, CheckCircle2, XCircle, Users, CalendarDays,
    Wallet, ListFilter, LoaderCircle, User, Globe2, CreditCard, Cake,
    Building2, Hash, ArrowRight, Armchair,
} from "lucide-react"
import api from '../api'
import { useTranslation } from "react-i18next"

export default function BookingsPage() {

    const { t } = useTranslation()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const [activeFilter, setActiveFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmAction, setConfirmAction] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [actionError, setActionError] = useState(null)
    const [processingId, setProcessingId] = useState(null)

    // Booking details modal (opened by clicking a row/card)
    const [selectedBooking, setSelectedBooking] = useState(null)

    const filters = [
        { key: "all", label: t("bookingsPage.status.all") },
        { key: "pending", label: t("bookingsPage.status.pending") },
        { key: "confirmed", label: t("bookingsPage.status.confirmed") },
        { key: "cancelled", label: t("bookingsPage.status.cancelled") },
    ]

    const statusStyle = {
        pending: "bg-amber-100 text-amber-600",
        confirmed: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-500",
    }

    const statusIcon = {
        pending: Clock3,
        cancelled: XCircle,
        confirmed: CheckCircle2,
    }

    const filteredBookings = bookings
        .filter((b) => activeFilter === "all" || b.status === activeFilter)
        .filter((b) =>
            (b.traveler || "N/A").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.tour || "").toLowerCase().includes(searchTerm.toLowerCase())
        )

    const stats = [
        {
            title: t("bookingsPage.totalRequests"),
            value: bookings.length,
            icon: ListFilter,
            color: "bg-slate-100 text-slate-600",
        },
        {
            title: t("bookingsPage.status.pending"),
            value: bookings.filter((b) => b.status === "pending").length,
            icon: Clock3,
            color: "bg-amber-100 text-amber-600",
        },
        {
            title: t("bookingsPage.status.confirmed"),
            value: bookings.filter((b) => b.status === "confirmed").length,
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
        },
        {
            title: t("bookingsPage.status.cancelled"),
            value: bookings.filter((b) => b.status === "cancelled").length,
            icon: XCircle,
            color: "bg-red-100 text-red-500",
        },
    ]

    // Opens the confirm modal — used by both desktop and mobile rows so
    // approve/reject always go through the same confirmation step.
    // stopPropagation so clicking these buttons doesn't also open the details modal.
    const requestAction = (e, id, type) => {
        e.stopPropagation()
        setActionError(null)
        setConfirmAction({ id, type })
    }

    const runAction = () => {
        if (!confirmAction) return

        const { id, type } = confirmAction
        const request = type === "approve"
            ? api.post(`agency/bookings/${id}/approve/`)
            : api.post(`agency/bookings/${id}/cancel/`)

        setActionLoading(true)
        setActionError(null)
        setProcessingId(id)

        request
            .then(() => {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.id === id
                            ? { ...b, status: type === "approve" ? "confirmed" : "cancelled" }
                            : b
                    )
                )
                setConfirmAction(null)
            })
            .catch((err) => {
                setActionError(
                    err?.response?.data?.detail || t("bookingsPage.somethingWentWrong")
                )
            })
            .finally(() => {
                setActionLoading(false)
                setProcessingId(null)
            })
    }

    const loadBookings = () => {
        setLoading(true);

        api.get("agency/bookings/")
            .then((res) => {
                setBookings(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadBookings();
    }, []);



    useEffect(() => {
        const socket = new WebSocket(`wss://${import.meta.env.VITE_API_WS}/ws/dashboard/`);

        socket.onopen = () => {
            console.log("Connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "new_booking":
                    setBookings((prev) => [
                        data.booking,
                        ...prev,
                    ]);
                    break;

                case "booking_cancelled":
                    setBookings((prev) =>
                        prev.map((b) =>
                            b.id === data.booking.id ? data.booking : b
                        )
                    );
                    break;

                case "booking_confirmed":
                    setBookings((prev) =>
                        prev.map((b) =>
                            b.id === data.booking.id ? data.booking : b
                        )
                    );
                    break;

                default:
                    break;
            }
        };

        socket.onclose = () => {
            console.log("Disconnected");
            setTimeout(connectSocket, 3000);
        };

        return () => socket.close();
    }, []);



    // Close the details modal on Escape
    useEffect(() => {
        if (!selectedBooking) return
        const onKeyDown = (e) => {
            if (e.key === "Escape") setSelectedBooking(null)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [selectedBooking])

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "—"
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return "—"
        const [h, m] = timeStr.split(":")
        if (h === undefined) return timeStr
        const d = new Date()
        d.setHours(Number(h), Number(m || 0))
        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            {t("bookingsPage.title")}
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">
                            {t("bookingsPage.subtitle")}
                        </p>
                    </div>

                    {/* <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search traveler or tour..."
                            className="w-full h-11 rounded-2xl text-black text-sm border border-slate-200 bg-white pl-10 pr-4 outline-none focus:border-amber-500 transition"
                        />
                    </div> */}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {stats.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon size={18} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 leading-none">
                                    {item.value}
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`h-9 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition ${activeFilter === f.key
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.traveler")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.tour")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.hotel")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.departure")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.travelers")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.totalPrice")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("bookingsPage.columns.status")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">{t("bookingsPage.columns.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">
                                            <span className="inline-flex items-center gap-2">
                                                <LoaderCircle size={16} className="animate-spin" />
                                                {t("bookingsPage.loadingBookings")}
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {filteredBookings.map((b) => {
                                            const StatusIcon = statusIcon[b.status]
                                            const travelerName = b.user.username || "N/A"
                                            const travelerNumber = b.user.phone_number || "N/A"
                                            const isRowBusy = processingId === b.id

                                            return (
                                                <tr
                                                    key={b.id}
                                                    onClick={() => setSelectedBooking(b)}
                                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition cursor-pointer"
                                                >
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                                                                {travelerName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 whitespace-nowrap">
                                                                    {travelerName}
                                                                </p>
                                                                <p className="text-slate-400 text-xs whitespace-nowrap">
                                                                    {travelerNumber}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                                        {b.tour}
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                                        {b.hotel}
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                                        {b.departure?.departure_date}
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Users size={13} className="text-slate-400" />
                                                            {b.travelers}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 font-semibold text-slate-900 whitespace-nowrap">
                                                        ${b.total_price}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle[b.status]}`}>
                                                            <StatusIcon size={12} />
                                                            {t(`bookingsPage.status.${b.status}`)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {b.status === "pending" ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={(e) => requestAction(e, b.id, "approve")}
                                                                    disabled={isRowBusy}
                                                                    className="h-9 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white text-xs font-semibold flex items-center gap-1.5"
                                                                >
                                                                    {isRowBusy ? <LoaderCircle size={14} className="animate-spin" /> : <Check size={14} />}
                                                                    {t("bookingsPage.approve")}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => requestAction(e, b.id, "reject")}
                                                                    disabled={isRowBusy}
                                                                    className="h-9 px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center gap-1.5"
                                                                >
                                                                    {isRowBusy ? <LoaderCircle size={14} className="animate-spin" /> : <X size={14} />}
                                                                    {t("bookingsPage.reject")}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <p className="text-right text-slate-400 text-xs">
                                                                {t("bookingsPage.noActionNeeded")}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                        {filteredBookings.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-5 py-8 text-center text-slate-400 text-sm">
                                                    {t("bookingsPage.noBookingsMatch")}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="md:hidden space-y-3">
                    {loading ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <LoaderCircle size={16} className="animate-spin" />
                            {t("bookingsPage.loadingBookings")}
                        </div>
                    ) : (
                        <>
                            {filteredBookings.map((b) => {
                                const StatusIcon = statusIcon[b.status]
                                const travelerName = b.traveler || "N/A"
                                const isRowBusy = processingId === b.id

                                return (
                                    <div
                                        key={b.id}
                                        onClick={() => setSelectedBooking(b)}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer active:bg-slate-50 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0">
                                                {travelerName.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 truncate">
                                                    {travelerName}
                                                </h3>
                                                <p className="text-slate-500 text-xs truncate">
                                                    {b.tour} · {b.hotel}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${statusStyle[b.status]}`}>
                                                <StatusIcon size={12} />
                                                {t(`bookingsPage.status.${b.status}`)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                            <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                <span className="text-slate-400 flex items-center gap-1"><CalendarDays size={11} /> {t("bookingsPage.columns.departure")}</span>
                                                <p className="font-semibold text-slate-700 mt-0.5">{b.departure?.departure_date}</p>
                                            </div>
                                            <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                <span className="text-slate-400 flex items-center gap-1"><Users size={11} /> {t("bookingsPage.columns.travelers")}</span>
                                                <p className="font-semibold text-slate-700 mt-0.5">{b.travelers}</p>
                                            </div>
                                            <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                <span className="text-slate-400 flex items-center gap-1"><Wallet size={11} /> {t("bookingsPage.total")}</span>
                                                <p className="font-semibold text-slate-700 mt-0.5">${b.total_price}</p>
                                            </div>
                                        </div>

                                        {b.status === "pending" && (
                                            <div className="flex items-center gap-2 mt-3">
                                                <button
                                                    onClick={(e) => requestAction(e, b.id, "approve")}
                                                    disabled={isRowBusy}
                                                    className="flex-1 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                                                >
                                                    {isRowBusy ? <LoaderCircle size={14} className="animate-spin" /> : <Check size={14} />} {t("bookingsPage.approve")}
                                                </button>
                                                <button
                                                    onClick={(e) => requestAction(e, b.id, "reject")}
                                                    disabled={isRowBusy}
                                                    className="flex-1 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center justify-center gap-1.5"
                                                >
                                                    {isRowBusy ? <LoaderCircle size={14} className="animate-spin" /> : <X size={14} />} {t("bookingsPage.reject")}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {filteredBookings.length === 0 && (
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                                    {t("bookingsPage.noBookingsMatch")}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ===================== Booking details modal ===================== */}
                {selectedBooking && (
                    <div
                        onClick={() => setSelectedBooking(null)}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in max-h-[92vh] flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 px-6 pt-6 pb-8 shrink-0">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-white"
                                >
                                    <X size={16} />
                                </button>
                                <p className="text-amber-100 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                                    <Hash size={12} /> {t("bookingsPage.bookingNumber", { id: selectedBooking.id })}
                                </p>
                                <h2 className="text-white text-2xl font-bold mt-1 pr-10">
                                    {selectedBooking.tour}
                                </h2>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-white/20 text-white">
                                        {(() => {
                                            const Icon = statusIcon[selectedBooking.status]
                                            return Icon ? <Icon size={12} /> : null
                                        })()}
                                        {t(`bookingsPage.status.${selectedBooking.status}`)}
                                    </span>
                                    {selectedBooking.created_at && (
                                        <span className="text-amber-100 text-xs">
                                            {t("bookingsPage.requestedAt", { date: formatDateTime(selectedBooking.created_at) })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-y-auto px-6 py-6 space-y-6">

                                {/* Trip & hotel */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                                        {t("bookingsPage.trip")}
                                    </h3>
                                    <div className="rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs">{t("bookingsPage.columns.hotel")}</p>
                                                <p className="font-semibold text-slate-800 text-sm">{selectedBooking.hotel}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                <Wallet size={16} />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs">{t("bookingsPage.columns.totalPrice")}</p>
                                                <p className="font-semibold text-slate-800 text-sm">${selectedBooking.total_price}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs">{t("bookingsPage.columns.travelers")}</p>
                                                <p className="font-semibold text-slate-800 text-sm">{selectedBooking.travelers}</p>
                                            </div>
                                        </div>
                                        {selectedBooking.departure?.available_seats !== undefined && (
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                    <Armchair size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs">{t("bookingsPage.availableSeats")}</p>
                                                    <p className="font-semibold text-slate-800 text-sm">{selectedBooking.departure.available_seats}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Schedule */}
                                {selectedBooking.departure && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                                            {t("bookingsPage.schedule")}
                                        </h3>
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="text-slate-400 text-xs flex items-center gap-1"><CalendarDays size={11} /> {t("bookingsPage.departs")}</p>
                                                    <p className="font-semibold text-slate-800 text-sm mt-1">{formatDate(selectedBooking.departure.departure_date)}</p>
                                                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                                        <Clock3 size={11} /> {formatTime(selectedBooking.departure.departure_time)}
                                                    </p>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-300 shrink-0" />
                                                <div className="flex-1 text-right">
                                                    <p className="text-slate-400 text-xs flex items-center gap-1 justify-end"><CalendarDays size={11} /> {t("bookingsPage.returns")}</p>
                                                    <p className="font-semibold text-slate-800 text-sm mt-1">{formatDate(selectedBooking.departure.return_date)}</p>
                                                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5 justify-end">
                                                        <Clock3 size={11} /> {formatTime(selectedBooking.departure.return_time)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Travelers info */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                                        {t("bookingsPage.travelerInformation")}
                                    </h3>

                                    {selectedBooking.travelers_info && selectedBooking.travelers_info.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedBooking.travelers_info.map((tr, idx) => (
                                                <div key={tr.id ?? idx} className="rounded-2xl border border-slate-200 p-4">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                                                            {(tr.full_name || "?").charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">
                                                                {tr.full_name || t("bookingsPage.notAvailable")}
                                                            </p>
                                                            <p className="text-slate-400 text-xs">
                                                                {t("bookingsPage.travelerOf", { number: idx + 1, total: selectedBooking.travelers_info.length })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                            <span className="text-slate-400 flex items-center gap-1"><Cake size={11} /> {t("bookingsPage.birthDate")}</span>
                                                            <p className="font-semibold text-slate-700 mt-0.5">{formatDate(tr.birth_date)}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                            <span className="text-slate-400 flex items-center gap-1"><Globe2 size={11} /> {t("booking.nationality")}</span>
                                                            <p className="font-semibold text-slate-700 mt-0.5">{tr.nationality || "—"}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-slate-50 px-3 py-2 col-span-2">
                                                            <span className="text-slate-400 flex items-center gap-1"><CreditCard size={11} /> {t("booking.passportNumber")}</span>
                                                            <p className="font-semibold text-slate-700 mt-0.5 tracking-wide">{tr.passport_number || "—"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-400 text-sm">
                                            {t("bookingsPage.noTravelerInfo")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {confirmAction && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl animate-in fade-in zoom-in">

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${confirmAction.type === "approve" ? "bg-emerald-100 text-emerald-500" : "bg-red-100 text-red-500"
                                }`}>
                                {confirmAction.type === "approve" ? <Check size={30} /> : <X size={30} />}
                            </div>

                            <h2 className="text-2xl font-bold text-center text-slate-900">
                                {confirmAction.type === "approve" ? t("bookingsPage.approveBookingTitle") : t("bookingsPage.rejectBookingTitle")}
                            </h2>

                            <p className="text-slate-500 text-center mt-3 leading-relaxed">
                                {confirmAction.type === "approve"
                                    ? t("bookingsPage.approveBookingDescription")
                                    : t("bookingsPage.rejectBookingDescription")}
                            </p>

                            {actionError && (
                                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
                                    <XCircle size={14} className="mt-0.5 shrink-0" />
                                    <span>{actionError}</span>
                                </div>
                            )}

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    disabled={actionLoading}
                                    className="flex-1 h-12 rounded-2xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-slate-700"
                                >
                                    {t("myTours.cancel")}
                                </button>

                                <button
                                    onClick={runAction}
                                    disabled={actionLoading}
                                    className={`flex-1 h-12 rounded-2xl transition text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${confirmAction.type === "approve"
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : "bg-red-500 hover:bg-red-600"
                                        }`}
                                >
                                    {actionLoading && <LoaderCircle size={16} className="animate-spin" />}
                                    {confirmAction.type === "approve" ? t("bookingsPage.approve") : t("bookingsPage.reject")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}