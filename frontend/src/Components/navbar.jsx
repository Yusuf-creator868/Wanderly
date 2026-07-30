import { Link, useNavigate } from "react-router-dom"
import { Menu, X, LayoutDashboard, User, LogOut, ChevronDown, Heart, Globe, Compass, MapPinned, Users2, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { logout } from "../api"
import { useAuth } from "../useAuth"
import { useTranslation } from 'react-i18next'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return localStorage.getItem('language') || 'ENG'
    })
    const [languageOpen, setLanguageOpen] = useState(false)
    const { i18n, t } = useTranslation()
    const { Auth, setAuth, user } = useAuth()

    const nav = useNavigate()

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "ENG";

        setSelectedLanguage(savedLanguage);

        const langMap = {
            ENG: "en",
            RUS: "ru",
            UZB: "uz",
        };

        i18n.changeLanguage(langMap[savedLanguage]);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        onScroll()
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, []);

    const languages = ['ENG', 'UZB', 'RUS',]

    const changeLanguage = (language) => {
        setSelectedLanguage(language);

        localStorage.setItem("language", language);

        const langMap = {
            ENG: "en",
            RUS: "ru",
            UZB: "uz",
        };

        i18n.changeLanguage(langMap[language]);
    };

    const navLinks = [
        // { to: "destinations", label: "Destinations", icon: MapPinned },
        // { to: "tours", label: "Tours", icon: Compass },
        // { to: "agencies", label: "Agencies", icon: Users2 },
        // { to: "features", label: "Why Us", icon: Sparkles },
    ]

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })

        setIsOpen(false)
    }

    const logoutbutton = async () => {
        const success = await logout()

        if (success) {
            setAuth(false)
            nav("/login")
        }
    }

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm"
                : "bg-white/60 backdrop-blur-md border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-[72px]">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group shrink-0"
                    >
                        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                            <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>

                        <div className="hidden sm:block leading-none">
                            <h1 className="font-bold text-lg text-slate-900 tracking-tight">
                                Wanderly
                            </h1>
                            <p className="text-[11px] text-amber-600 font-medium">
                                Explore The World
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    {/* <div className="hidden md:flex items-center gap-1 bg-slate-100/70 rounded-full p-1">
                        {navLinks.map((item) => (
                            <button
                                key={item.to}
                                onClick={() => scrollToSection(item.to)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-amber-700 hover:bg-white hover:shadow-sm transition-all"
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                            </button>
                        ))}
                    </div> */}

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center gap-3">

                        <Link
                            to="/favorites"
                            className="relative w-10 h-10 rounded-full border border-slate-200 hover:border-amber-300 hover:bg-amber-50 flex items-center justify-center transition-all"
                        >
                            <Heart size={18} className="text-slate-600 group-hover:text-amber-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border-2 border-white" />
                        </Link>

                        {/* Language Dropdown */}
                        <div className="relative">

                            <button
                                onClick={() => setLanguageOpen(!languageOpen)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:border-amber-300 transition-all text-sm font-semibold text-slate-700"
                            >
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                {selectedLanguage}
                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${languageOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {languageOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-14 right-0 w-32 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                                    >
                                        {languages.map((language, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    changeLanguage(language)
                                                    setLanguageOpen(false)
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-amber-50 ${selectedLanguage === language
                                                    ? 'text-amber-700 bg-amber-50'
                                                    : 'text-slate-700'
                                                    }`}
                                            >
                                                {language}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-6 bg-slate-200" />

                        {!Auth ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={user?.role === "agency" ? "/overview" : "/profile"}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] transition-all"
                                >
                                    {user?.role === "agency" ? (
                                        <LayoutDashboard className="w-4 h-4" />
                                    ) : (
                                        <User className="w-4 h-4" />
                                    )}
                                    {user?.role === "agency" ? "Dashboard" : "Profile"}
                                </Link>

                                <button
                                    onClick={logoutbutton}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        )}

                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="w-5 h-5 text-slate-800" />
                        ) : (
                            <Menu className="w-5 h-5 text-slate-800" />
                        )}
                    </button>

                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden border-t border-slate-200"
                        >
                            <div className="py-5 space-y-5">

                                {/* Mobile Links */}
                                <div className="flex flex-col gap-1">
                                    {/* {navLinks.map((item) => (
                                        <button
                                            key={item.to}
                                            onClick={() => scrollToSection(item.to)}
                                            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
                                        >
                                            <item.icon className="w-4 h-4 text-amber-500" />
                                            {item.label}
                                        </button>
                                    ))} */}

                                    <Link
                                        to="/favorites"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
                                    >
                                        <Heart className="w-4 h-4 text-amber-500" />
                                        Favorites
                                    </Link>
                                </div>

                                {/* Mobile Language Selector */}
                                <div className="px-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                        Language
                                    </p>
                                    <div className="flex gap-2">
                                        {languages.map((language, index) => (
                                            <button
                                                key={index}
                                                onClick={() => changeLanguage(language)}
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedLanguage === language
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                                                    : 'bg-slate-100 text-slate-700'
                                                    }`}
                                            >
                                                {language}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile Auth */}
                                <div className="pt-4 px-4 border-t border-slate-200 flex flex-col gap-3">

                                    {!Auth ? (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-3 rounded-xl border border-slate-200 text-center font-semibold text-slate-700"
                                            >
                                                Sign In
                                            </Link>

                                            <Link
                                                to="/register"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center font-semibold shadow-md"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to={user?.role === "agency" ? "/overview" : "/profile"}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md"
                                            >
                                                {user?.role === "agency" ? (
                                                    <LayoutDashboard className="w-4 h-4" />
                                                ) : (
                                                    <User className="w-4 h-4" />
                                                )}

                                                {user?.role === "agency" ? "Dashboard" : "Profile"}
                                            </Link>

                                            <button
                                                onClick={logoutbutton}
                                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </>
                                    )}

                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.nav>
    )
}