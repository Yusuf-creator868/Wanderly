import { useEffect, useState } from "react"
import { Mail, Phone, BadgeCheck, Pencil, MapPin, CalendarDays, Users, Building2, AlertCircle, ArrowUpRight, ArrowRight, Check, X, ChevronDown, User } from "lucide-react"
import api, { MAIN_URL } from "../api"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../useAuth"

const STATUS_STYLES = {
    pending: { label: "Pending", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
    confirmed: { label: "Confirmed", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
    cancelled: { label: "Cancelled", dot: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-600" },
    completed: { label: "Completed", dot: "bg-[#E2600C]", bg: "bg-[#FDEEE3]", text: "text-[#B54A09]" },
}

// Turns a traveler_info key like "passport_number" into "Passport Number"
const humanizeKey = (key) =>
    key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * TravelerProfilePage — single-file version, editable header.
 *
 * Props:
 *  - onViewBooking(bookingId), onExplore
 */
export default function TravelerProfilePage({
    onViewBooking = () => { },
    onExplore = () => { },
}) {
    const [currentTraveler, setCurrentTraveler] = useState({
        email: "",
        phone_number: "",
        role: "",
        username: "",
    })
    const [bookings, setBookings] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const nav = useNavigate()
    const loc = useLocation()
    const from = loc.state?.from;
    // Tracks which booking card currently has its travelers panel open
    const [openTravelersId, setOpenTravelersId] = useState(null)
    const { userinfo, loadUser, } = useAuth();

    const startEditing = () => {
        setIsEditing(true)
    }

    const cancelEditing = () => {
        setIsEditing(false)
    }

    const saveEditing = async () => {
        try {
            setIsEditing(false);

            const res = await api.post("user-info/", currentTraveler);

            await loadUser();

            console.log(res.data);

            if (from) {
                nav(from);
            } else {
                nav("/");
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const updateField = (field) => (e) => {
        setCurrentTraveler((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const toggleTravelers = (bookingId) => {
        setOpenTravelersId((prev) => (prev === bookingId ? null : bookingId))
    }

    useEffect(() => {
        api.get('user-info/')
            .then(res => {
                console.log(res.data)
                setCurrentTraveler(res.data)
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [])

    useEffect(() => {
        api.get('booking_detail/')
            .then(res => {
                console.log(res.data)
                // API can return either a bare array or a paginated { results: [...] } shape
                const data = Array.isArray(res.data) ? res.data : res.data?.results ?? []
                setBookings(data)
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* Elegant serif for headings — swap for a self-hosted font file in production */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
                body { font-family: 'Inter', sans-serif; }
            `}</style>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">

                {/* ============ PROFILE HEADER ============ */}
                <div
                    className="
                        bg-white
                        border border-[#F3E4D8]
                        rounded-3xl
                        shadow-[0_2px_20px_rgba(20,20,20,0.04)]
                        p-6 sm:p-8 md:p-10
                    "
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">

                        {/* AVATAR */}
                        <div className="relative shrink-0 mx-auto sm:mx-0">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-br from-[#FBB27E] via-[#E2600C] to-[#FBB27E] flex items-center justify-center">
                                {currentTraveler.avatarUrl ? (
                                    <img
                                        src={currentTraveler.avatarUrl}
                                        alt={currentTraveler.username}
                                        className="w-full h-full rounded-full object-cover border-4 border-white"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-[#FFF8F3] border-4 border-white flex items-center justify-center">
                                        <User size={36} className="text-[#E2600C]" />
                                    </div>
                                )}
                            </div>
                            <div
                                className="
                                    absolute -bottom-1 -right-1
                                    w-8 h-8 rounded-full
                                    bg-[#1C1B1A]
                                    flex items-center justify-center
                                    border-2 border-white
                                "
                                title="Verified traveler"
                            >
                                <BadgeCheck size={15} className="text-[#FBB27E]" />
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex-1 text-center sm:text-left w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                                {isEditing ? (
                                    <input
                                        value={currentTraveler.username}
                                        onChange={updateField("username")}
                                        placeholder="Full name"
                                        className="
                                            font-['Fraunces',serif] text-2xl sm:text-3xl text-[#1C1B1A]
                                            bg-[#FFF8F3] border border-[#F3D9C4]
                                            rounded-xl px-3 py-1.5
                                            w-full sm:w-auto
                                            outline-none focus:border-[#E2600C]
                                            transition-colors
                                        "
                                    />
                                ) : (
                                    <h1 className="font-['Fraunces',serif] text-2xl sm:text-3xl text-[#1C1B1A]">
                                        {currentTraveler.username}
                                    </h1>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-4 justify-center sm:justify-start">
                                {isEditing ? (
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Phone size={15} className="text-[#E2600C] shrink-0" />
                                        <input
                                            value={currentTraveler.phone_number}
                                            onChange={updateField("phone_number")}
                                            placeholder="Phone number"
                                            type="tel"
                                            className="
                                                text-sm text-[#1C1B1A]
                                                bg-[#FFF8F3] border border-[#F3D9C4]
                                                rounded-xl px-3 py-1.5
                                                w-full sm:w-48
                                                outline-none focus:border-[#E2600C]
                                                transition-colors
                                            "
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[#6B6660] text-sm">
                                            <Mail size={15} className="text-[#E2600C]" />
                                            {currentTraveler.email}
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[#6B6660] text-sm">

                                            <Phone size={15} className="text-[#E2600C]" />
                                            {currentTraveler.phone_number ? (
                                                <span className="text-[#6B6660]">
                                                    {currentTraveler.phone_number}
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                                                    <AlertCircle size={14} />
                                                    <span className="text-xs font-medium">Required</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* EDIT / SAVE CONTROLS */}
                        <div className="shrink-0 flex justify-center sm:justify-end gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={cancelEditing}
                                        className="
                                            inline-flex items-center gap-2
                                            px-5 py-3 rounded-full
                                            border border-[#E7E2D9]
                                            text-[#6B6660] text-sm font-semibold
                                            hover:bg-[#FAF8F4]
                                            transition-colors duration-300
                                        "
                                    >
                                        <X size={15} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEditing}
                                        className="
                                            inline-flex items-center gap-2
                                            px-6 py-3 rounded-full
                                            bg-[#E2600C] hover:bg-[#C6510A]
                                            text-white text-sm font-semibold
                                            tracking-wide
                                            transition-colors duration-300
                                        "
                                    >
                                        <Check size={15} />
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startEditing}
                                    className="
                                        inline-flex items-center gap-2
                                        px-6 py-3 rounded-full
                                        bg-[#1C1B1A] hover:bg-[#E2600C]
                                        text-white text-sm font-semibold
                                        tracking-wide
                                        transition-colors duration-300
                                    "
                                >
                                    <Pencil size={15} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============ BOOKINGS ============ */}
                {bookings.length > 0 ? (
                    bookings.map((booking) => {
                        const style = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending
                        const travelersOpen = openTravelersId === booking.id
                        const travelersInfo = booking.travelers_info ?? []

                        return (
                            <div
                                key={booking.id}
                                className="
                                    group relative
                                    bg-white
                                    border border-[#F3E4D8]
                                    rounded-3xl
                                    overflow-hidden
                                    shadow-[0_2px_16px_rgba(20,20,20,0.04)]
                                    hover:shadow-[0_18px_40px_rgba(20,20,20,0.09)]
                                    hover:border-[#F3B98A]
                                    transition-all duration-300 ease-out
                                "
                            >
                                <div className="flex flex-col sm:flex-row">

                                    {/* IMAGE */}
                                    <div className="relative w-full sm:w-[300px] md:w-[340px] h-56 sm:h-auto shrink-0 overflow-hidden">
                                        <img
                                            src={`${booking.tour?.cover_image ?? ""}`}
                                            alt={booking.tour?.title}
                                            className="
                                                w-full h-full object-cover
                                                transition-transform duration-500
                                                group-hover:scale-105
                                            "
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span
                                                className={`
                                                    inline-flex items-center gap-2
                                                    px-3 py-1.5 rounded-full
                                                    text-xs font-semibold uppercase tracking-wide
                                                    ${style.bg} ${style.text}
                                                `}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                {style.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 p-6 md:p-7 flex flex-col justify-between gap-5">

                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-['Fraunces',serif] text-xl md:text-2xl text-[#1C1B1A] leading-snug">
                                                    {booking.tour?.title}
                                                </h3>

                                                <div className="flex items-center gap-1.5 text-[#8A857C] text-sm mt-2">
                                                    <MapPin size={14} className="text-[#E2600C]" />
                                                    <span>{booking.tour?.city}, {booking.tour?.country}</span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 hidden sm:block">
                                                <p className="text-[11px] uppercase tracking-wider text-[#B3AC9E]">
                                                    Total Price
                                                </p>
                                                <p className="font-['Fraunces',serif] text-2xl text-[#E2600C] mt-1">
                                                    ${booking.total_price}
                                                </p>
                                            </div>
                                        </div>

                                        {/* STATS ROW */}
                                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                            <div className="rounded-2xl bg-[#FFF8F3] px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-[#B3AC9E] text-[11px] uppercase tracking-wide">
                                                    <CalendarDays size={12} />
                                                    Departure
                                                </div>
                                                <p className="text-[#1C1B1A] text-sm font-semibold mt-1">
                                                    {booking.departure?.departure_date}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-[#FFF8F3] px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-[#B3AC9E] text-[11px] uppercase tracking-wide">
                                                    <CalendarDays size={12} />
                                                    Return
                                                </div>
                                                <p className="text-[#1C1B1A] text-sm font-semibold mt-1">
                                                    {booking.departure?.return_date}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-[#FFF8F3] px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-[#B3AC9E] text-[11px] uppercase tracking-wide">
                                                    <Users size={12} />
                                                    Travelers
                                                </div>
                                                <p className="text-[#1C1B1A] text-sm font-semibold mt-1">
                                                    {booking.travelers}
                                                </p>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="flex items-center justify-between pt-1 border-t border-[#F5EEE5]">
                                            <div className="flex items-center gap-2 text-[#8A857C] text-sm pt-4">
                                                <Building2 size={15} className="text-[#B3AC9E]" />
                                                {booking.hotel?.name}
                                                {booking.hotel?.stars ? (
                                                    <span className="text-[#E2600C] text-xs font-semibold">
                                                        {"★".repeat(booking.hotel.stars)}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="flex items-center gap-3 pt-4">
                                                <p className="sm:hidden font-['Fraunces',serif] text-lg text-[#E2600C]">
                                                    ${booking.total_price}
                                                </p>

                                                <button
                                                    onClick={() => toggleTravelers(booking.id)}
                                                    aria-expanded={travelersOpen}
                                                    className={`
                                                        group/btn inline-flex items-center gap-1.5
                                                        px-5 py-2.5 rounded-full
                                                        border transition-colors duration-300
                                                        text-sm font-semibold
                                                        ${travelersOpen
                                                            ? "bg-[#FFF8F3] border-[#E2600C] text-[#E2600C]"
                                                            : "border-[#E7E2D9] text-[#6B6660] hover:bg-[#FAF8F4]"}
                                                    `}
                                                >
                                                    <Users size={15} />
                                                    Travelers
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform duration-300 ${travelersOpen ? "rotate-180" : ""}`}
                                                    />
                                                </button>


                                            </div>
                                        </div>

                                        {/* ============ TRAVELERS PANEL ============ */}
                                        {travelersOpen && (
                                            <div className="mt-1 pt-4 border-t border-[#F5EEE5] space-y-3">
                                                {travelersInfo.length > 0 ? (
                                                    travelersInfo.map((traveler, idx) => (
                                                        <div
                                                            key={traveler.id ?? idx}
                                                            className="
                                                                rounded-2xl bg-[#FFF8F3]
                                                                border border-[#F3E4D8]
                                                                px-4 py-3
                                                            "
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-7 h-7 rounded-full bg-[#FDEEE3] flex items-center justify-center shrink-0">
                                                                    <User size={13} className="text-[#E2600C]" />
                                                                </div>
                                                                <p className="text-sm font-semibold text-[#1C1B1A]">
                                                                    {traveler.full_name ?? traveler.name ?? `Traveler ${idx + 1}`}
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-9">
                                                                {Object.entries(traveler)
                                                                    .filter(([key]) => !["id", "full_name", "name"].includes(key))
                                                                    .map(([key, value]) => (
                                                                        <div key={key}>
                                                                            <p className="text-[10px] uppercase tracking-wide text-[#B3AC9E]">
                                                                                {humanizeKey(key)}
                                                                            </p>
                                                                            <p className="text-xs text-[#4A453E] font-medium mt-0.5">
                                                                                {String(value)}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-[#8A857C] px-1">
                                                        No traveler details available for this booking.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    /* ============ EMPTY STATE ============ */
                    <div
                        className="
                            flex flex-col items-center text-center
                            py-16 px-6
                            bg-white
                            border border-[#F3E4D8]
                            rounded-3xl
                            shadow-[0_2px_20px_rgba(20,20,20,0.04)]
                        "
                    >
                        <div
                            className="
                                w-28 h-28 rounded-full
                                bg-[#FDEEE3]
                                flex items-center justify-center
                                mb-8
                            "
                        >
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="28" cy="28" r="19" stroke="#E2600C" strokeWidth="1.4" />
                                <circle cx="28" cy="28" r="1.6" fill="#E2600C" />
                                <path d="M28 12.5 L33 27 L28 43.5 L23 27 Z" fill="none" stroke="#E2600C" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M28 17 L30.5 27 L28 36 L25.5 27 Z" fill="#E2600C" opacity="0.5" />
                                <line x1="28" y1="4" x2="28" y2="9" stroke="#E2600C" strokeWidth="1.2" strokeLinecap="round" />
                                <line x1="28" y1="47" x2="28" y2="52" stroke="#E2600C" strokeWidth="1.2" strokeLinecap="round" />
                                <line x1="4" y1="28" x2="9" y2="28" stroke="#E2600C" strokeWidth="1.2" strokeLinecap="round" />
                                <line x1="47" y1="28" x2="52" y2="28" stroke="#E2600C" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                        </div>

                        <p className="font-['Fraunces',serif] text-2xl text-[#1C1B1A]">
                            You haven't booked any trips yet.
                        </p>

                        <p className="text-[#8A857C] text-sm mt-3 max-w-sm">
                            Your next journey is waiting. Browse our curated collection of
                            tours and start planning something unforgettable.
                        </p>

                        <button
                            onClick={() => nav("/search")}
                            className="
                                group inline-flex items-center gap-2
                                mt-8 px-7 py-3.5 rounded-full
                                bg-[#1C1B1A] hover:bg-[#E2600C]
                                text-white text-sm font-semibold
                                tracking-wide
                                transition-colors duration-300
                            "
                        >
                            Explore Tours
                            <ArrowRight
                                size={16}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}