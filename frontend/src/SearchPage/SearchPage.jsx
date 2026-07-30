import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Search, SlidersHorizontal, MapPin, Clock3, Users, Star, Heart, ChevronDown, X, Sparkles, Globe, User, ChevronLeft, ChevronRight } from "lucide-react"
import Card from "./Card"
import api from "../api"
import { Link } from "react-router-dom"
import { Range, getTrackBackground } from "react-range";
import { Navbar } from "../Components/navbar"

// Must match the page_size configured on TourPagination in the backend.
// If your paginator returns page_size in the payload, read it from there instead.
const PAGE_SIZE = 12



function CustomSelect({ value, onChange, options, className = "" }) {
    const [open, setOpen] = useState(false)



    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 pr-8 text-sm text-left outline-none focus:border-orange-500 bg-white flex items-center justify-between"
            >
                <span className="truncate">{value}</span>
                <ChevronDown
                    size={15}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute z-20 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-lg py-1 max-h-56 overflow-auto">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    onChange(opt)
                                    setOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 text-sm transition ${opt === value
                                    ? "text-orange-600 font-semibold bg-orange-50"
                                    : "text-slate-700 hover:bg-orange-50"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}


// Builds a compact page-number list with ellipses, e.g. [1, '...', 4, 5, 6, '...', 20]
function getPageList(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages = new Set([1, total, current, current - 1, current + 1])
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)

    const result = []
    let prev = null
    for (const p of sorted) {
        if (prev !== null && p - prev > 1) {
            result.push("...")
        }
        result.push(p)
        prev = p
    }
    return result
}


function useDebounce(value, delay = 200) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value]);

    return debounced;
}








export default function SearchToursPage() {

    const { t } = useTranslation()

    const hideTimeoutRef = useRef(null);
    const [data, setdata] = useState([])
    const [query, setQuery] = useState("");
    // const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const fav_code = localStorage.getItem("fav_code")



    const [showFilters, setShowFilters] = useState(false)
    const [activeCategories, setActiveCategories] = useState([])

    const [favorites, setFavorites] = useState([])
    const [country, setCountry] = useState("All Countries")
    const [sortBy, setSortBy] = useState("Sort: Relevance")

    // PAGINATION
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    })

    // Tracks previous filters/query so we only reset to page 1 on an
    // actual filter/search change, not on every render.
    const prevFiltersRef = useRef(null)
    const prevQueryRef = useRef(null)
    const isFirstRunRef = useRef(true)








    const [filters, setFilters] = useState({



        // category
        category: "",

        // price
        min_price: "",
        max_price: "",

        // duration
        min_duration: "",
        max_duration: "",

        // date
        departure_date: "",

        // hotel
        hotel_stars: "",
        meal_plan: "",

        // included
        flight_included: false,

        // rating
        min_rating: "",

        // ordering
        ordering: "-created_at",
        fav_code: fav_code,
    })



    const categories = [
        { label: t("categories.luxury"), value: "luxury" },
        { label: t("categories.adventure"), value: "adventure" },
        { label: t("categories.beach"), value: "beach" },
        { label: t("categories.honeymoon"), value: "honeymoon" },
        { label: t("categories.family"), value: "family" },
        { label: t("categories.cultural"), value: "cultural" },
    ]

    const hotelStars = [3, 4, 5]

    const mealPlans = [
        { label: t("mealPlans.breakfast"), value: "breakfast" },
        { label: t("mealPlans.halfBoard"), value: "half_board" },
        { label: t("mealPlans.fullBoard"), value: "full_board" },
        { label: t("mealPlans.allInclusive"), value: "all_inclusive" },
    ]

    const sortOptions = [
        { label: t("sort.newest"), value: "-created_at" },
        { label: t("sort.topRated"), value: "-rating" },
        { label: t("sort.priceLowHigh"), value: "price" },
        { label: t("sort.priceHighLow"), value: "-price" },
    ]


    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }



    const debouncedQuery = useDebounce(query, 200);
    const debouncedFilters = useDebounce(filters, 200)


    useEffect(() => {

        const filtersChanged =
            JSON.stringify(prevFiltersRef.current) !== JSON.stringify(debouncedFilters)
        const queryChanged = prevQueryRef.current !== debouncedQuery

        prevFiltersRef.current = debouncedFilters
        prevQueryRef.current = debouncedQuery

        // On a real filter/search change, jump back to page 1.
        // If we're not already on page 1, setPage will trigger this
        // effect again (via the `page` dependency) and that second
        // run will do the actual fetch — so we skip fetching now.
        if (!isFirstRunRef.current && (filtersChanged || queryChanged)) {
            if (page !== 1) {
                setPage(1)
                return
            }
        }

        isFirstRunRef.current = false
        fetchTours()

    }, [debouncedFilters, debouncedQuery, page])



    const fetchTours = async () => {

        try {

            setLoading(true)

            const params = {}

            Object.entries(debouncedFilters).forEach(([key, value]) => {

                if (
                    value !== "" &&
                    value !== null &&
                    value !== undefined &&
                    value !== false
                ) {
                    params[key] = value
                }

            })

            if (debouncedQuery) {
                params.q = debouncedQuery
            }

            params.page = page

            // CHECK IF USER IS ACTUALLY FILTERING/SEARCHING
            // (ignore the always-present ordering/fav_code/page keys)
            const meaningfulKeys = Object.keys(params).filter(
                (key) => !["ordering", "fav_code", "page"].includes(key)
            )

            const hasFilters = meaningfulKeys.length > 0 || !!debouncedQuery

            let res

            // FILTERED / SEARCHED
            if (hasFilters) {

                res = await api.get(
                    "tour/",
                    { params }
                )

            }

            // DEFAULT TOURS
            else {

                res = await api.get(
                    `get_tours/?fav_code=${fav_code}&page=${page}`
                )

            }

            const results = res.data?.results ?? res.data ?? []

            setdata(results)
            setPagination({
                count: res.data?.count ?? results.length,
                next: res.data?.next ?? null,
                previous: res.data?.previous ?? null,
            })

        } catch (err) {

            console.log(err)

        } finally {

            setLoading(false)

        }
    }


    const STEP = 50;
    const MIN = 0;
    const MAX = 10000;

    // Inside your component
    const values = [
        Number(filters.min_price || MIN),
        Number(filters.max_price || MAX),
    ];


    const MIN_DAYS = 1;
    const MAX_DAYS = 90;

    const durationValues = [
        Number(filters.min_duration || MIN_DAYS),
        Number(filters.max_duration || MAX_DAYS),
    ];

    const totalPages = Math.max(1, Math.ceil(pagination.count / PAGE_SIZE))

    const goToPage = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
        setPage(nextPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* TOP NAV */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
                <Navbar />
            </header>


            {/* HERO */}
            <div className="relative h-80 overflow-hidden mt-18">
                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/65 to-orange-900/50" />

                <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-semibold mb-3">
                        <Sparkles size={14} />
                        {t("hero.badge")}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
                        {t("hero.title")}
                    </h1>

                    <p className="text-white/75 mt-2 text-base max-w-xl">
                        {t("hero.subtitle")}
                    </p>

                    {/* SEARCH */}
                    <div className="mt-5 bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('hero.searchPlaceholder')}
                                className="w-full h-11 text-black rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
                            />
                        </div>
                        <button className="h-11 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white text-sm font-semibold flex items-center justify-center gap-2 shrink-0">
                            <Search size={16} />
                            {t("common.search")}
                        </button>
                    </div>
                </div>
            </div>

            {/* STATS STRIP */}
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-3 z-10">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
                    {[
                        { icon: Sparkles, label: t("stats.activeTours"), value: "120+" },
                        { icon: Globe, label: t("stats.destinations"), value: "45+" },
                        { icon: Star, label: t("stats.avgRating"), value: "4.8" },
                        { icon: Users, label: t("stats.happyTravelers"), value: "10k+" },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2.5 px-3 sm:px-4 py-3.5">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <Icon size={17} />
                            </div>
                            <div className="leading-tight">
                                <p className="text-sm sm:text-base font-bold text-slate-900">{value}</p>
                                <p className="text-xs text-slate-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* MAIN */}
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* FILTERS */}

                    <aside
                        className={`
            fixed left-0 top-0 z-50
            h-screen w-full max-w-sm
            bg-white
            overflow-y-auto
            p-5
            transition-transform duration-300

            ${showFilters
                                ? "translate-x-0"
                                : "-translate-x-full"
                            }

            lg:static
            lg:h-auto
            lg:max-w-none
            lg:w-72
            lg:translate-x-0
            lg:bg-transparent
            lg:p-0
        `}
                    >

                        <div className="bg-white rounded-3xl border border-slate-200 p-5 sticky top-5">

                            {/* HEADER */}

                            <div className="flex items-center justify-between mb-6">

                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal
                                        size={18}
                                        className="text-orange-500"
                                    />

                                    <h2 className="font-bold text-[26px] text-slate-900">
                                        {t("filters.title")}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {
                                        setFilters({
                                            category: "",
                                            min_price: "",
                                            max_price: "",
                                            min_duration: "",
                                            max_duration: "",
                                            departure_date: "",
                                            hotel_stars: "",
                                            meal_plan: "",
                                            flight_included: false,
                                            min_rating: "",
                                            ordering: "-created_at",
                                            fav_code: fav_code,
                                        })
                                    }}
                                    className="text-sm bg-orange-500 rounded-[12px] hover:bg-orange-700 cursor-pointer font-medium px-3 py-2"
                                >
                                    {t("filters.clear")}
                                </button>

                                <div className="mb-6 flex items-center justify-between lg:hidden">


                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-black"
                                    >
                                        <X size={24} />
                                    </button>

                                </div>
                            </div>

                            <div className="space-y-6">


                                {/* CATEGORY */}

                                <div>

                                    <label className="text-sm font-semibold text-slate-900 mb-3 block">
                                        {t("filters.category")}
                                    </label>

                                    <div className="flex flex-wrap gap-2">

                                        {categories.map((item) => (

                                            <button
                                                key={item.value}
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "category",
                                                        filters.category === item.value
                                                            ? ""
                                                            : item.value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-full text-xs font-medium border transition
                                
                            ${filters.category === item.value
                                                        ? "bg-orange-500 border-orange-500 text-white"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-orange-300"
                                                    }
                            
                            `}
                                            >
                                                {item.label}
                                            </button>

                                        ))}

                                    </div>

                                </div>

                                {/* Price */}

                                <div>
                                    <label className="mb-4 block text-sm font-semibold text-slate-900">
                                        {t("filters.priceRange")}
                                    </label>

                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                                            ${values[0]}
                                        </span>

                                        <span className="text-sm text-slate-400">—</span>

                                        <span className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                                            ${values[1]}
                                        </span>
                                    </div>

                                    <Range
                                        values={values}
                                        step={STEP}
                                        min={MIN}
                                        max={MAX}
                                        onChange={(values) => {
                                            handleFilterChange("min_price", values[0]);
                                            handleFilterChange("max_price", values[1]);
                                        }}
                                        renderTrack={({ props, children }) => {
                                            const { key, ...rest } = props;

                                            return (
                                                <div
                                                    key={key}
                                                    {...rest}
                                                    className="h-2 w-full rounded-full"
                                                    style={{
                                                        ...rest.style,
                                                        touchAction: "none",
                                                        background: getTrackBackground({
                                                            values: values,
                                                            colors: ["#e5e7eb", "#f97316", "#e5e7eb"],
                                                            min: MIN,
                                                            max: MAX,
                                                        }),
                                                    }}
                                                >
                                                    {children}
                                                </div>
                                            );
                                        }}
                                        renderThumb={({ props }) => {
                                            const { key, ...rest } = props;

                                            return (
                                                <div
                                                    key={key}
                                                    {...rest}
                                                    className="h-6 w-6 rounded-full border-4 border-orange-500 bg-white shadow-lg"
                                                />
                                            );
                                        }}
                                    />

                                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                                        <span>${MIN}</span>
                                        <span>${MAX}</span>
                                    </div>
                                </div>

                                {/* DURATION */}

                                <div>
                                    <label className="mb-4 block text-sm font-semibold text-slate-900">
                                        {t("filters.duration")}
                                    </label>

                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                                            {t("duration.days", { count: durationValues[0] })}
                                        </span>

                                        <span className="text-sm text-slate-400">—</span>

                                        <span className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
                                            {t("duration.days", { count: durationValues[1] })}
                                        </span>
                                    </div>

                                    <Range
                                        values={durationValues}
                                        step={1}
                                        min={MIN_DAYS}
                                        max={MAX_DAYS}
                                        onChange={(values) => {
                                            handleFilterChange("min_duration", values[0]);
                                            handleFilterChange("max_duration", values[1]);
                                        }}
                                        renderTrack={({ props, children }) => {
                                            const { key, ...rest } = props;

                                            return (
                                                <div
                                                    key={key}
                                                    {...rest}
                                                    className="h-2 w-full rounded-full"
                                                    style={{
                                                        ...rest.style,
                                                        touchAction: "none",
                                                        background: getTrackBackground({
                                                            values: durationValues,
                                                            colors: ["#e5e7eb", "#f97316", "#e5e7eb"],
                                                            min: MIN_DAYS,
                                                            max: MAX_DAYS,
                                                        }),
                                                    }}
                                                >
                                                    {children}
                                                </div>
                                            );
                                        }}
                                        renderThumb={({ props }) => {
                                            const { key, ...rest } = props;

                                            return (
                                                <div
                                                    key={key}
                                                    {...rest}
                                                    className="h-6 w-6 rounded-full border-4 border-orange-500 bg-white shadow-lg"
                                                />
                                            );
                                        }}
                                    />
                                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                                        <span>{t("duration.days", { count: MIN_DAYS })}</span>
                                        <span>{t("duration.days", { count: MAX_DAYS })}</span>
                                    </div>
                                </div>

                                {/* DATE */}

                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-slate-900">
                                        {t("filters.departure")}
                                    </label>

                                    <div className="space-y-3">

                                        {[
                                            { label: t("departure.anytime"), value: "" },
                                            { label: t("departure.thisWeek"), value: "this_week" },
                                            { label: t("departure.nextWeek"), value: "next_week" },
                                            { label: t("departure.thisMonth"), value: "this_month" },
                                            { label: t("departure.nextMonth"), value: "next_month" },
                                            { label: t("departure.next3Months"), value: "next_3_months" },
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex cursor-pointer items-center gap-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name="departure"
                                                    value={option.value}
                                                    checked={filters.departure_date === option.value}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "departure_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-4 w-4 accent-orange-500"
                                                />

                                                <span className="text-sm text-slate-700">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}

                                    </div>
                                </div>

                                {/* HOTEL STARS */}

                                <div>

                                    <label className="text-sm font-semibold text-slate-900 mb-3 block">
                                        {t("filters.hotelStars")}
                                    </label>

                                    <div className="flex gap-2">

                                        {hotelStars.map((star) => (

                                            <button
                                                key={star}
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "hotel_stars",
                                                        filters.hotel_stars === star
                                                            ? ""
                                                            : star
                                                    )
                                                }
                                                className={`flex items-center gap-1 px-3 py-2 rounded-full border text-sm transition
                            
                            ${filters.hotel_stars === star
                                                        ? "bg-orange-500 border-orange-500 text-white"
                                                        : "border-slate-200 text-slate-700"
                                                    }
                            
                            `}
                                            >
                                                {star}
                                                <Star size={14} />
                                            </button>

                                        ))}

                                    </div>

                                </div>

                                {/* MEAL PLAN */}

                                <div>

                                    <label className="text-sm font-semibold text-slate-900 mb-3 block">
                                        {t("filters.mealPlan")}
                                    </label>

                                    <div className="flex flex-wrap gap-2">

                                        {mealPlans.map((item) => (

                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "meal_plan",
                                                        filters.meal_plan === item.value
                                                            ? ""
                                                            : item.value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-full border text-xs font-medium transition

                ${filters.meal_plan === item.value
                                                        ? "bg-orange-500 border-orange-500 text-white"
                                                        : "border-slate-200 text-slate-700 hover:border-orange-300"
                                                    }

                `}
                                            >
                                                {item.label}
                                            </button>

                                        ))}

                                    </div>

                                </div>

                                {/* FLIGHT INCLUDED */}

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {t("filters.flightIncluded")}
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            {t("filters.flightIncludedDesc")}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleFilterChange(
                                                "flight_included",
                                                !filters.flight_included
                                            )
                                        }
                                        className={`w-12 h-7 rounded-full transition relative
                        
                    ${filters.flight_included
                                                ? "bg-orange-500"
                                                : "bg-slate-200"
                                            }
                    
                    `}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition
                    
                    ${filters.flight_included
                                                ? "left-6"
                                                : "left-1"
                                            }
                    
                    `} />
                                    </button>

                                </div>

                                {/* ---------------- */}
                            </div>

                        </div>

                    </aside>

                    {/* TOURS */}
                    <div className="flex-1 min-w-0">

                        {/* TOP BAR */}
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{t("results.toursFound", { count: pagination.count })}</h2>
                                <p className="text-slate-500 text-sm mt-0.5">{t("results.subtitle")}</p>
                            </div>

                            <div className="mb-5 flex lg:hidden">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm"
                                >
                                    <SlidersHorizontal size={18} />
                                    {t("filters.title")}
                                </button>
                            </div>
                        </div>

                        {/* TOUR GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">

                            {loading ? (
                                <p className="p-4 text-gray-400 text-sm">
                                    {t("results.loading")}
                                </p>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <Card key={item.id ?? index} item={item} />
                                ))
                            ) : (
                                <p className="p-4 text-gray-400 text-sm">
                                    {t("results.noResults")}
                                </p>
                            )}

                        </div>

                        {/* PAGINATION */}
                        {!loading && totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-1.5">

                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={!pagination.previous}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {getPageList(page, totalPages).map((p, idx) =>
                                    p === "..." ? (
                                        <span
                                            key={`ellipsis-${idx}`}
                                            className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition
                                                ${p === page
                                                    ? "bg-orange-500 text-white"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300"
                                                }
                                            `}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={!pagination.next}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={16} />
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}