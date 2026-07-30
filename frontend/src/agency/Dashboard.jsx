import {
    Users, Globe, CalendarDays, DollarSign, Star, TrendingUp, TrendingDown,
    Clock3, MapPinned, Eye, ArrowUpRight, Plus, Ticket, UserPlus, CompassIcon,
} from "lucide-react"
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
} from "recharts"

export default function DashboardPage() {

    const stats = [
        {
            title: "Total Tours",
            value: 28,
            icon: Globe,
            growth: "+12%",
            up: true,
        },
        {
            title: "Bookings",
            value: 482,
            icon: CalendarDays,
            growth: "+18%",
            up: true,
        },
        {
            title: "Revenue",
            value: "$24.8K",
            icon: DollarSign,
            growth: "+22%",
            up: true,
        },
        {
            title: "Travelers",
            value: 1290,
            icon: Users,
            growth: "+9%",
            up: true,
        },
    ]

    const quickActions = [
        { label: "Create Tour", icon: Plus },
        { label: "Manage Bookings", icon: Ticket },
        { label: "View Travelers", icon: UserPlus },
        { label: "Add Destination", icon: CompassIcon },
    ]

    const bookingData = [
        { month: "Jan", bookings: 12 },
        { month: "Feb", bookings: 18 },
        { month: "Mar", bookings: 24 },
        { month: "Apr", bookings: 30 },
        { month: "May", bookings: 41 },
        { month: "Jun", bookings: 55 },
    ]

    const revenueData = [
        { month: "Jan", revenue: 2400 },
        { month: "Feb", revenue: 4200 },
        { month: "Mar", revenue: 5200 },
        { month: "Apr", revenue: 7300 },
        { month: "May", revenue: 9800 },
        { month: "Jun", revenue: 12400 },
    ]

    const recentBookings = [
        {
            name: "John Carter",
            tour: "Maldives Escape",
            price: "$2,400",
            status: "Confirmed",
        },
        {
            name: "Emily Stone",
            tour: "Dubai Luxury",
            price: "$1,900",
            status: "Pending",
        },
        {
            name: "Ali Hassan",
            tour: "Swiss Adventure",
            price: "$3,100",
            status: "Confirmed",
        },
    ]

    const topTours = [
        {
            title: "Luxury Maldives Escape",
            bookings: 82,
            revenue: "$18.2K",
            share: 82,
        },
        {
            title: "Dubai Desert Premium",
            bookings: 64,
            revenue: "$12.8K",
            share: 64,
        },
        {
            title: "Swiss Alps Adventure",
            bookings: 49,
            revenue: "$9.4K",
            share: 49,
        },
    ]

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Dashboard
                        </h1>

                        <p className="text-slate-500 mt-1 text-sm">
                            Monitor your tours, bookings, and travelers
                        </p>
                    </div>

                    <button
                        className="h-11 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <ArrowUpRight size={17} />
                        Create New Tour
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">

                    {stats.map((item, index) => {
                        const isRevenue = item.title === "Revenue"

                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-4"
                            >
                                <div className={isRevenue ? "blur-[4px] select-none pointer-events-none" : ""}>
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                                            <item.icon className="text-amber-500" size={18} />
                                        </div>

                                        <div
                                            className={`flex items-center gap-1 text-xs font-semibold ${item.up ? "text-emerald-500" : "text-red-500"
                                                }`}
                                        >
                                            {item.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                            {item.growth}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mt-3 leading-none">
                                        {item.value}
                                    </h2>

                                    <p className="text-slate-500 text-xs mt-1">
                                        {item.title}
                                    </p>
                                </div>

                                {isRevenue && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20">
                                            Coming Soon
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className="bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition rounded-2xl p-4 flex items-center gap-3 text-left"
                        >
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                <action.icon size={16} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">

                    {/* BOOKINGS */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-slate-900">
                                Monthly Bookings
                            </h2>

                            <p className="text-slate-500 mt-0.5 text-xs">
                                Tour booking growth overview
                            </p>
                        </div>

                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bookingData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="bookings" radius={[10, 10, 0, 0]} fill="#f59e0b" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* REVENUE */}
                    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="blur-[6px] select-none pointer-events-none">
                            <div className="mb-4">
                                <h2 className="text-base font-bold text-slate-900">
                                    Revenue Overview
                                </h2>

                                <p className="text-slate-500 mt-0.5 text-xs">
                                    Revenue performance in recent months
                                </p>
                            </div>

                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                            <div className="px-5 py-1.5 rounded-full bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/20">
                                Coming Soon
                            </div>

                            <p className="text-slate-500 text-xs mt-3 max-w-xs">
                                Revenue analytics will be available after payment integration.
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                    {/* RECENT BOOKINGS */}
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Recent Bookings
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Latest traveler reservations
                                </p>
                            </div>

                            <button className="text-amber-600 hover:text-amber-700 font-semibold text-xs">
                                View All
                            </button>
                        </div>

                        <div className="space-y-2">
                            {recentBookings.map((booking, index) => (
                                <div
                                    key={index}
                                    className="border border-slate-100 rounded-xl p-3 hover:border-amber-300 transition"
                                >
                                    <div className="flex items-center justify-between gap-4">

                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                                                {booking.name.charAt(0)}
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-slate-900 text-sm truncate">
                                                    {booking.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {booking.tour}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-semibold text-slate-900 text-sm hidden sm:inline">
                                                {booking.price}
                                            </span>

                                            <div
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${booking.status === "Confirmed"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-amber-100 text-amber-600"
                                                    }`}
                                            >
                                                {booking.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOP TOURS + ACTIVITY */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Top Tours
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Most successful travel packages
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {topTours.map((tour, index) => (
                                <div
                                    key={index}
                                    className="border border-slate-100 rounded-xl p-3 hover:border-amber-300 transition"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                                            {tour.title}
                                        </h3>

                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <Star size={14} />
                                        </div>
                                    </div>

                                    <div className="w-full h-1.5 rounded-full bg-slate-100 mt-3 overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${tour.share}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                                            <Users size={13} />
                                            {tour.bookings} bookings
                                        </div>

                                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                                            <DollarSign size={13} />
                                            {tour.revenue}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* QUICK INFO */}
                        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 p-4">
                            <h3 className="font-bold text-slate-900 text-sm mb-3">
                                Platform Activity
                            </h3>

                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Eye size={15} />
                                        Profile Views
                                    </div>
                                    <span className="font-bold text-slate-900">8.2K</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock3 size={15} />
                                        Pending Requests
                                    </div>
                                    <span className="font-bold text-slate-900">12</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPinned size={15} />
                                        Active Destinations
                                    </div>
                                    <span className="font-bold text-slate-900">14</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}