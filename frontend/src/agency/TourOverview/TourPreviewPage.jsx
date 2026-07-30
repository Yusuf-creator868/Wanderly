import {
    MapPin,
    Clock3,
    Users,
    Star,
    Check,
    X,
    ImageIcon,
    CalendarDays,
    Loader2,
} from "lucide-react"
import { useEffect, useState } from "react"
import api, { MAIN_URL } from "../../api"

/**
 * TourPreviewModal
 *
 * Modal version of the tour preview page.
 *
 * Props:
 *  - tourId: id of the tour to load (fetch is skipped if falsy)
 *  - isOpen: whether the modal is visible
 *  - onClose: called when the user dismisses the modal
 */
export default function TourPreviewModal({ tourId, isOpen, onClose }) {

    const [tourData, setTourData] = useState(null)
    const [loading, setLoading] = useState(false)

    // Fetch tour data whenever the modal is opened for a given tour
    useEffect(() => {
        if (!isOpen || !tourId) return

        setLoading(true)
        api.get(`tour_details/${tourId}/`)
            .then(res => {
                setTourData(res.data)
            })
            .catch(err => {
                console.log(err.message)
            })
            .finally(() => setLoading(false))
    }, [isOpen, tourId])

    // Reset state once the modal is fully closed so the next open starts fresh
    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => setTourData(null), 200)
            return () => clearTimeout(timeout)
        }
    }, [isOpen])

    // Escape key closes the modal
    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => {
            if (e.key === "Escape") onClose?.()
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isOpen, onClose])

    // Lock body scroll while the modal is open
    useEffect(() => {
        if (isOpen) {
            const original = document.body.style.overflow
            document.body.style.overflow = "hidden"
            return () => { document.body.style.overflow = original }
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <>
        <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp {
                from { transform: translateY(24px); opacity: 0 }
                to { transform: translateY(0); opacity: 1 }
            }
        `}</style>
        <div
            className="
                fixed inset-0 z-50
                flex items-end sm:items-center justify-center
                bg-slate-900/60 backdrop-blur-sm
                sm:p-4
                animate-[fadeIn_0.18s_ease-out]
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose?.()
            }}
        >
            <div
                className="
                    relative w-full sm:max-w-5xl
                    max-h-[92vh] sm:max-h-[90vh]
                    bg-[#f8fafc]
                    rounded-t-3xl sm:rounded-3xl
                    overflow-hidden
                    shadow-2xl
                    flex flex-col
                    animate-[slideUp_0.22s_ease-out]
                "
            >
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="
                        absolute top-5 right-5 z-20
                        w-11 h-11 rounded-2xl
                        bg-white/20 backdrop-blur-md
                        text-white
                        flex items-center justify-center
                        hover:bg-white/30 active:scale-95
                        transition
                    "
                >
                    <X size={20} />
                </button>

                {/* SCROLLABLE BODY */}
                <div className="overflow-y-auto flex-1">

                    {loading || !tourData ? (
                        <div className="h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm font-medium">Loading tour…</p>
                        </div>
                    ) : (
                        <>
                            {/* HERO */}
                            <div className="relative h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden shrink-0">
                                <img
                                    src={`${tourData?.cover_image}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                                {/* CATEGORY BADGE */}
                                <div className="absolute top-5 left-5">
                                    <div
                                        className="
                                            px-4 py-1.5 rounded-full
                                            bg-amber-500 text-white
                                            text-sm font-semibold capitalize
                                            shadow-sm
                                        "
                                    >
                                        {tourData.category}
                                    </div>
                                </div>

                                {/* TITLE + META */}
                                <div className="absolute bottom-6 left-5 right-16 sm:left-8 sm:right-8">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                                        {tourData.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 text-white/90 text-sm">
                                            <MapPin size={16} />
                                            <span>{tourData.city}, {tourData.country}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-white/90 text-sm">
                                            <Clock3 size={16} />
                                            <span>{tourData.duration} Days</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-white/90 text-sm">
                                            <Users size={16} />
                                            <span>{tourData.total_seats} Travelers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CONTENT GRID */}
                            <div className="px-5 sm:px-8 py-8">
                                <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

                                    {/* LEFT COLUMN */}
                                    <div className="space-y-6">

                                        {/* ABOUT */}
                                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                About This Tour
                                            </h2>
                                            <p className="text-slate-600 leading-7 mt-3">
                                                {tourData.description}
                                            </p>
                                        </section>

                                        {/* GALLERY */}
                                        {tourData?.images?.length > 0 && (
                                            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <ImageIcon size={20} className="text-amber-500" />
                                                    <h2 className="text-xl font-bold text-slate-900">
                                                        Tour Gallery
                                                    </h2>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {tourData.images.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className="aspect-[4/3] rounded-xl overflow-hidden"
                                                        >
                                                            <img
                                                                src={`${image.image}`}
                                                                alt=""
                                                                className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* HOTELS */}
                                        {tourData?.hotels?.map((hotel, index) => (
                                            <section
                                                key={index}
                                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                                            >
                                                {hotel?.images?.length > 0 && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
                                                        {hotel.images.map((image, imgIndex) => (
                                                            <div key={imgIndex} className="h-32 rounded-xl overflow-hidden">
                                                                <img
                                                                    src={`${image.image}`}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="p-5 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-900">
                                                                {hotel.name}
                                                            </h3>
                                                            <div className="flex items-center gap-1 mt-1.5">
                                                                {[...Array(hotel?.stars)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={14}
                                                                        className="fill-amber-400 text-amber-400"
                                                                    />
                                                                ))}
                                                            </div>
                                                           
                                                        </div>

                                                        <div className="flex flex-wrap gap-5">
                                                            <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                                                                {hotel.room_type}
                                                            </span>
                                                            <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                                                {hotel.meal_plan}
                                                            </span>
                                                            <span className="text-orange-400">${hotel.price}</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-600 leading-7 mt-4 text-sm">
                                                        {hotel.description}
                                                    </p>
                                                </div>
                                            </section>
                                        ))}

                                        {/* INCLUDED / EXCLUDED */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <section className="bg-white border border-slate-200 rounded-2xl p-5">
                                                <h3 className="text-base font-bold text-slate-900 mb-4">
                                                    What's Included
                                                </h3>
                                                <div className="space-y-3">
                                                    {tourData?.included_items?.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <div className="min-w-[20px] h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                                                <Check size={12} className="text-green-600" />
                                                            </div>
                                                            <p className="text-slate-600 text-sm">{item.title}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section className="bg-white border border-slate-200 rounded-2xl p-5">
                                                <h3 className="text-base font-bold text-slate-900 mb-4">
                                                    Not Included
                                                </h3>
                                                <div className="space-y-3">
                                                    {tourData?.excluded_items?.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <div className="min-w-[20px] h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                                                                <X size={12} className="text-red-500" />
                                                            </div>
                                                            <p className="text-slate-600 text-sm">{item.title}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>

                                        {/* ITINERARY */}
                                        {tourData?.itinerary?.length > 0 && (
                                            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                                                <h2 className="text-xl font-bold text-slate-900 mb-6">
                                                    Tour Itinerary
                                                </h2>

                                                <div className="space-y-4">
                                                    {tourData.itinerary.map((day, index) => (
                                                        <div key={index} className="flex gap-3">
                                                            <div className="min-w-[44px] h-11 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                                                                {index + 1}
                                                            </div>

                                                            <div className="flex-1 bg-slate-50 rounded-xl p-4">
                                                                <h3 className="text-base font-bold text-slate-900">
                                                                    {day.title}
                                                                </h3>
                                                                <p className="text-slate-600 mt-2 leading-6 text-sm">
                                                                    {day.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>

                                    {/* RIGHT COLUMN — DEPARTURES */}
                                    <div className="xl:sticky xl:top-0 xl:self-start">
                                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={20} className="text-amber-500" />
                                                <h2 className="text-lg font-black text-slate-900">
                                                    Departures
                                                </h2>
                                            </div>

                                            <div className="space-y-3 mt-5">
                                                {tourData?.departures?.map((departure, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-xl border border-slate-100 p-4 hover:border-amber-200 transition"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-xs text-slate-500">
                                                                    Departure
                                                                </p>
                                                                <h3 className="font-bold text-slate-900 mt-0.5 text-sm">
                                                                    {departure.departure_date}
                                                                </h3>
                                                            </div>

                                                           
                                                        </div>

                                                        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
                                                            <Users size={13} />
                                                            <span>{departure.available_seats} seats available</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                         
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}