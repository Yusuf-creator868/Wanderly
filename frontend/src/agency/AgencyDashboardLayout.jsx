import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Map, CalendarCheck, Users, Star, BarChart3, UserCircle2, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, Bell, Plus, } from "lucide-react";
import api, { MAIN_URL } from "../api";

export default function AgencyDashboardLayout() {
    const { t } = useTranslation();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [slug, setslug] = useState()
    const [agencydata, setagencydata] = useState()

    useEffect(() => {
        const fetchAgency = async () => {
            try {
                const res = await api.get("my-agency/");
                console.log(res.data)
                setslug(res.data.slug);
                setagencydata(res.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchAgency();
    }, []);


    const links = [
        // {
        //     name: "dashboard",
        //     label: t("sidebar.nav.dashboard.label"),
        //     mobileLabel: t("sidebar.nav.dashboard.mobileLabel"),
        //     icon: LayoutDashboard,
        // },
        {
            name: "myTours",
            label: t("sidebar.nav.myTours.label"),
            mobileLabel: t("sidebar.nav.myTours.mobileLabel"),
            icon: Map,
        },
        {
            name: "bookings",
            label: t("sidebar.nav.bookings.label"),
            mobileLabel: t("sidebar.nav.bookings.mobileLabel"),
            icon: CalendarCheck,
        },
        // {
        //     name: "travelers",
        //     label: t("sidebar.nav.travelers.label"),
        //     mobileLabel: t("sidebar.nav.travelers.mobileLabel"),
        //     icon: Users,
        // },
        // {
        //     name: "reviews",
        //     label: t("sidebar.nav.reviews.label"),
        //     mobileLabel: t("sidebar.nav.reviews.mobileLabel"),
        //     icon: Star,
        // },
        // {
        //     name: "analytics",
        //     label: t("sidebar.nav.analytics.label"),
        //     mobileLabel: t("sidebar.nav.analytics.mobileLabel"),
        //     icon: BarChart3,
        // },
        {
            name: `profile/${slug}`,
            label: t("sidebar.nav.profile.label"),
            mobileLabel: t("sidebar.nav.profile.mobileLabel"),
            icon: UserCircle2,
        },
    ];

    const navigate = useNavigate();

    const currentTab = location.pathname.split("/")[2];

    const linkStyle = (name) =>
        currentTab === name
            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
            : "text-slate-600 hover:bg-amber-50 hover:text-amber-600";


    const createDraft = async () => {
        try {
            const res = await api.post("/create_tour/");

            navigate(`/overview/createTour/${res.data.id}`);
        } catch (err) {
            if (err.response?.status === 403) {
                alert(
                    "Your agency must be verified before creating tours. Please upload your verification documents and wait for approval."
                );
                return;
            }

            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen z-50 bg-white/95 backdrop-blur-xl border-r border-slate-200 transition-all duration-300

                    ${collapsed ? "w-[90px]" : "w-[280px]"}

                    lg:translate-x-0
                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                <div className="flex flex-col h-full p-5">
                    {/* TOP */}
                    <div>
                        {/* LOGO */}
                        <div className="flex items-center justify-between mb-10">
                            {!collapsed && (
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <span className="text-white font-bold text-lg">
                                            W
                                        </span>
                                    </div>

                                    <div>
                                        <h1 className="text-xl font-bold text-slate-900">
                                            Wanderly
                                        </h1>

                                        {/* <p className="text-sm text-slate-500">
                                            {t("sidebar.tagline")}
                                        </p> */}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                {/* COLLAPSE */}
                                <button
                                    onClick={() =>
                                        setCollapsed(!collapsed)
                                    }
                                    className=" hidden lg:flex w-10 h-10 rounded-xl border text-black border-slate-200 items-center justify-center hover:bg-slate-100 transition "
                                >
                                    {collapsed ? (
                                        <ChevronRight size={18} />
                                    ) : (
                                        <ChevronLeft size={18} />
                                    )}
                                </button>

                                {/* MOBILE CLOSE */}
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className=" lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center "
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* CREATE TOUR */}
                        {!collapsed && (
                            <button
                                onClick={createDraft}
                                className=" w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mb-8 "
                            >
                                <Plus size={20} />
                                {t("sidebar.createTour")}
                            </button>
                        )}

                        {/* NAVIGATION */}
                        <div className="space-y-2">
                            {links.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.name}
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                        className={` flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${linkStyle(item.name)} `}
                                    >
                                        <Icon size={22} />

                                        {!collapsed && (
                                            <>
                                                <span className="font-medium hidden sm:block">
                                                    {item.label}
                                                </span>

                                                <span className="font-medium sm:hidden">
                                                    {item.mobileLabel}
                                                </span>
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-auto space-y-2">
                        {/* SETTINGS */}
                        {/* <Link
                            to="settings"
                            className={` flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${linkStyle("settings")} `}
                        >
                            <Settings size={22} />

                            {!collapsed && (
                                <>
                                    <span className="font-medium hidden sm:block">
                                        {t("sidebar.settings")}
                                    </span>

                                    <span className="font-medium sm:hidden">
                                        {t("sidebar.settingsShort")}
                                    </span>
                                </>
                            )}
                        </Link> */}

                        {/* LOGOUT */}
                        {/* <button
                            className=" w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-200 "
                        >
                            <LogOut size={22} />

                            {!collapsed && (
                                <>
                                    <span className="font-medium hidden sm:block">
                                        {t("sidebar.logout")}
                                    </span>

                                    <span className="font-medium sm:hidden">
                                        {t("sidebar.logoutShort")}
                                    </span>
                                </>
                            )}
                        </button> */}
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div
                className={`
                    flex-1 transition-all duration-300
                    ${collapsed ? "lg:ml-[90px]" : "lg:ml-[280px]"}
                `}
            >
                {/* TOPBAR */}
                <header
                    className=" sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 "
                >
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                        {/* LEFT */}
                        <div className="flex items-center gap-4">
                            {/* MOBILE MENU */}
                            <button
                                onClick={() => setMobileOpen(true)}
                                className=" lg:hidden w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center "
                            >
                                <Menu size={22} />
                            </button>

                            {/* TITLE */}
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {t("topbar.title")}
                                </h2>

                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    {t("topbar.subtitle")}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* NOTIFICATIONS */}
                            {/* <button
                                className=" relative w-11 h-11 text-black rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition "
                            >
                                <Bell size={20} />

                                <span
                                    className=" absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 "
                                />
                            </button> */}

                            {/* PROFILE */}
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block text-right">
                                    <h4 className="font-semibold text-slate-900">
                                        {agencydata?.agency_name}
                                    </h4>

                                    <p className="text-sm text-amber-600 font-medium">
                                        {t("topbar.proAgency")}
                                    </p>
                                </div>

                                <img
                                    src={`${agencydata?.logo}`}
                                    alt='logo'
                                    className="w-15 h-15 sm:w-15 sm:h-15 rounded-2xl object-cover border-4 border-white bg-white shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}