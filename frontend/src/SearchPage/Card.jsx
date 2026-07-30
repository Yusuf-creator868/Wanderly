import { useEffect, useState } from "react";
import {
    MapPin,
    Clock,
    Users,
    Star,
    Heart,
    Plane,
    Utensils,
    BadgeCheck,
    Car,
    Download,
    Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api, { MAIN_URL } from "../api";

export default function Card({ item }) {
    const { t } = useTranslation();

    const fav_code = localStorage.getItem("fav_code")

    const [fav, setFav] = useState(item.is_favorite);

    useEffect(() => {
        setFav(item.is_favorite);
    }, [item.is_favorite]);

    function toggleFavorite() {

        if (fav) {

            api.delete("remove_favorite/", {
                data: {
                    fav_code,
                    tour_id: item.id
                }
            })
                .then(() => {
                    setFav(false)
                })

        } else {

            api.post("add_favorite/", {
                fav_code,
                tour_id: item.id
            })
                .then(() => {
                    setFav(true)
                })
                .catch(err => {
                    console.log(err.response.data)
                })
        }
    }

    return (

        <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">

            {/* IMAGE */}
            <div className="relative overflow-hidden h-56 bg-slate-200">

                <img
                    src={
                        item.cover_image?.startsWith("http")
                            ? item.cover_image
                            : `${MAIN_URL}${item.cover_image}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />

                {/* BADGE */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">
                    {item.category}
                </div>

                {/* WISHLIST */}
                <button
                    onClick={toggleFavorite}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition shadow-md"
                >
                    <Heart
                        size={20}
                        className={
                            fav
                                ? "fill-red-500 text-red-500"
                                : "text-slate-400"
                        }
                    />
                </button>

                <span className="absolute bottom-4 left-4 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-medium text-white shadow-sm">
                    ({t("card.reviews", { count: item.tour_views })})
                </span>
            </div>

            {/* BODY */}
            <div className="flex-1 p-6 flex flex-col justify-between">

                <div>

                    {/* TITLE */}
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2">
                        {item.title}
                    </h3>

                    {/* LOCATION */}
                    <div className="flex items-center gap-1 text-slate-600 text-sm mt-3 mb-4">
                        <MapPin size={14} />
                        <span>
                            {item.from_city}, {item.from_country} → {item.city}, {item.country}
                        </span>
                    </div>

                    {/* RATING */}
                    {/* <div className="flex items-center gap-2 mt-4 mb-4"> */}
                        {/* <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={i < Math.floor(4.9) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">4.9</span> */}
                        {/* <span className="text-xs text-slate-500">({item.tour_views} reviews)</span> */}
                    {/* </div> */}

                    {/* DURATION */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 ">
                            <Clock size={14} />
                            <span>{t("card.durationDaysNights", { days: item.duration, nights: item.nights })}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <Users size={14} />
                            <span>{t("card.seatsLeft", { count: item.total_seats })}</span>
                        </div>
                    </div>

                    {/* INCLUSIONS */}
                    <div className="flex flex-wrap gap-2 mb-4">

                        {item.flight_included && (
                            <div className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                <Plane size={11} />
                                {t("card.flightIncluded")}
                            </div>
                        )}

                        {item.meals_included && (
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                <Utensils size={11} />
                                {t("card.mealsIncluded")}
                            </div>
                        )}

                        {item.guide_included && (
                            <div className="flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                <BadgeCheck size={11} />
                                {t("card.tourGuide")}
                            </div>
                        )}

                        {true && (
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                <Car size={11} />
                                {t("card.transportIncluded")}
                            </div>
                        )}

                    </div>

                </div>

                {/* FOOTER */}
                <div className="border-t border-slate-200 pt-4">


                    <div className="flex items-end justify-between ">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">{t("card.from")}</span>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-amber-600 leading-none">${item.price}</span>
                                <span className="text-[11px] text-slate-400 mb-0.5">{t("card.perPerson")}</span>
                            </div>
                        </div>

                        <Link
                            to={`/details/${item.id}`}
                            className="px-3 py-2  bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-semibold text-white transition shadow-md flex items-center justify-center gap-2"
                        >
                            <Eye size={15} />
                            <span>{t("card.viewTour")}</span>
                        </Link>
                    </div>



                </div>

            </div>

        </div>

    )
}