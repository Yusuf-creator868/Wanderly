import { MapPin, Users, Eye, Pencil, Trash2, Clock3, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import api, { MAIN_URL } from "../api"
import { Link } from "react-router-dom"
import TourPreviewModal from "./TourOverview/TourPreviewPage"

export default function MyTours() {

    const { t } = useTranslation()
    const [publishedTours, setpublishedTours] = useState([])
    const [draftTours, setdraftTours] = useState([])
    const [data, setdata] = useState([])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [selectedTourId, setSelectedTourId] = useState(null)

    // preview modal state
    const [previewTourId, setPreviewTourId] = useState(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    const openPreview = (tourId) => {
        setPreviewTourId(tourId)
        setIsPreviewOpen(true)
    }

    const closePreview = () => {
        setIsPreviewOpen(false)
    }

    useEffect(() => {
        api.get('/get_agency_tour/')
            .then(res => {
                const published = res.data.filter((tour) => tour.status === 'published')
                const draft = res.data.filter((tour) => tour.status === 'draft')

                setpublishedTours(published)
                setdraftTours(draft)
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [])

    const delete_tour = async () => {
        try {
            await api.delete(`delete_tour/${selectedTourId}`)

            setpublishedTours((prev) => prev.filter((tour) => tour.id !== selectedTourId))
            setdraftTours((prev) => prev.filter((tour) => tour.id !== selectedTourId))
            setOpenDeleteModal(false)
            setSelectedTourId(null)
        } catch (error) {
            console.error("Failed to delete tour:", error)
        }
    }

    useEffect(() => {
        api.get('get_mytour_data')
            .then(res => {
                setdata(res.data)
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [])

    // shows the value if it exists, otherwise a placeholder dash
    const val = (v) => (v === undefined || v === null || v === '') ? '----' : v
    const location = (item) => (item.city || item.country) ? `${val(item.city)}, ${val(item.country)}` : '----'

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {t("myTours.title")}
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    {t("myTours.subtitle")}
                </p>
            </div>

            {/* STATS */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">

                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-none">
                            {publishedTours?.length ?? 0}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">Total Tours</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <Eye size={18} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-none">4.2K</h3>
                        <p className="text-slate-500 text-xs mt-1">Total Views</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Users size={18} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-none">248</h3>
                        <p className="text-slate-500 text-xs mt-1">Travelers</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-none">
                            {draftTours?.length ?? 0}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">Drafts</p>
                    </div>
                </div>
            </div> */}

            {/* PUBLISHED TOURS */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                        {t("myTours.publishedTours")}
                    </h2>
                    <span className="text-xs font-medium text-slate-400">
                        {t("myTours.total", { count: publishedTours.length })}
                    </span>
                </div>

                {/* TABLE - tablet & up */}
                <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.tour")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.location")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.duration")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.seats")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.status")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">{t("myTours.columns.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publishedTours.map((tour) => (
                                    <tr key={tour.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`${MAIN_URL}${tour.cover_image}`}
                                                    alt=""
                                                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                                                />
                                                <span className="font-semibold text-slate-900 whitespace-nowrap">
                                                    {val(tour.title)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-slate-400" />
                                                {location(tour)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                            {val(tour.duration)}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                            {val(tour.total_seats)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold whitespace-nowrap">
                                                {val(tour.status)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/overview/update/${tour.id}`}
                                                    className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white flex items-center justify-center"
                                                    title={t("myTours.editTour")}
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => openPreview(tour.id)}
                                                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 transition text-slate-700 flex items-center justify-center"
                                                    title={t("myTours.preview")}
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTourId(tour.id)
                                                        setOpenDeleteModal(true)
                                                    }}
                                                    className="w-9 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center"
                                                    title={t("myTours.delete")}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {publishedTours.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-sm">
                                            {t("myTours.noPublishedTours")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CARDS - phones */}
                <div className="md:hidden space-y-3">
                    {publishedTours.map((tour) => (
                        <div key={tour.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={`${tour.cover_image}`}
                                    alt=""
                                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">
                                        {val(tour.title)}
                                    </h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                                        <MapPin size={12} />
                                        <span className="truncate">{location(tour)}</span>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold shrink-0">
                                    {val(tour.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                    <span className="text-slate-400">{t("myTours.columns.duration")}</span>
                                    <p className="font-semibold text-slate-700">{val(tour.duration)}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                    <span className="text-slate-400">{t("myTours.columns.seats")}</span>
                                    <p className="font-semibold text-slate-700">{val(tour.total_seats)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                <Link
                                    to={`/overview/update/${tour.id}`}
                                    className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                    <Pencil size={13} /> {t("myTours.edit")}
                                </Link>
                                <button
                                    onClick={() => openPreview(tour.id)}
                                    className="flex-1 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                    <Eye size={13} /> {t("myTours.preview")}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTourId(tour.id)
                                        setOpenDeleteModal(true)
                                    }}
                                    className="w-9 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center shrink-0"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {publishedTours.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                            {t("myTours.noPublishedTours")}
                        </div>
                    )}
                </div>
            </div>

            {/* DRAFTS */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                        {t("myTours.draftTours")}
                    </h2>
                    <span className="text-xs font-medium text-slate-400">
                        {t("myTours.total", { count: draftTours.length })}
                    </span>
                </div>

                {/* TABLE - tablet & up */}
                <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.tour")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.location")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.duration")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.seats")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{t("myTours.columns.status")}</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">{t("myTours.columns.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {draftTours.map((draft) => (
                                    <tr key={draft.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                    <Clock3 size={16} />
                                                </div>
                                                <span className="font-semibold text-slate-900 whitespace-nowrap">
                                                    {val(draft.title)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-slate-400" />
                                                {location(draft)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                            {val(draft.duration)}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                            {val(draft.total_seats)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold whitespace-nowrap">
                                                {val(draft.status)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/overview/update/${draft.id}`}
                                                    className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                                                >
                                                    <Pencil size={13} /> {t("myTours.edit")}
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTourId(draft.id)
                                                        setOpenDeleteModal(true)
                                                    }}
                                                    className="w-9 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center"
                                                    title={t("myTours.delete")}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {draftTours.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-sm">
                                            {t("myTours.noDrafts")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CARDS - phones */}
                <div className="md:hidden space-y-3">
                    {draftTours.map((draft) => (
                        <div key={draft.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                    <Clock3 size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">
                                        {val(draft.title)}
                                    </h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                                        <MapPin size={12} />
                                        <span className="truncate">{location(draft)}</span>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold shrink-0">
                                    {val(draft.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                    <span className="text-slate-400">{t("myTours.columns.duration")}</span>
                                    <p className="font-semibold text-slate-700">{val(draft.duration)}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                    <span className="text-slate-400">{t("myTours.columns.seats")}</span>
                                    <p className="font-semibold text-slate-700">{val(draft.total_seats)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                <button
                                    className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                    <Pencil size={13} /> {t("myTours.continueEditing")}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTourId(draft.id)
                                        setOpenDeleteModal(true)
                                    }}
                                    className="w-9 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center shrink-0"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {draftTours.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                            {t("myTours.noDrafts")}
                        </div>
                    )}
                </div>
            </div>

            {/* DELETE MODAL */}
            {openDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl animate-in fade-in zoom-in">

                        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-5">
                            <Trash2 size={30} />
                        </div>

                        <h2 className="text-2xl font-bold text-center text-slate-900">
                            {t("myTours.deleteTourTitle")}
                        </h2>

                        <p className="text-slate-500 text-center mt-3 leading-relaxed">
                            {t("myTours.deleteTourWarning")}
                        </p>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setOpenDeleteModal(false)
                                    setSelectedTourId(null)
                                }}
                                className="flex-1 h-12 rounded-2xl border border-slate-200 hover:bg-slate-50 transition font-semibold text-slate-700"
                            >
                                {t("myTours.cancel")}
                            </button>

                            <button
                                onClick={delete_tour}
                                className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 transition text-white font-semibold"
                            >
                                {t("myTours.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOUR PREVIEW MODAL */}
            <TourPreviewModal
                tourId={previewTourId}
                isOpen={isPreviewOpen}
                onClose={closePreview}
            />
        </div>
    )
}