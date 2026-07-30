import { useEffect, useState } from "react"
import api from "../api"
import { Heart } from "lucide-react"
import Card from "./Card"
import { useNavigate } from "react-router-dom";
export default function FavoritesPage() {

    const [favorites, setFavorites] = useState([])
    const navigate = useNavigate();
    const fav_code = localStorage.getItem("fav_code")

    useEffect(() => {

        api.get(`get_favorites?fav_code=${fav_code}`,)
            .then(res => {
                setFavorites(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err.error)
            })

    }, [])

    return (

        <div className="min-h-screen bg-slate-50">

            {/* HEADER */}
            <div className="border-b border-slate-200 bg-white">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">

                            <Heart
                                size={20}
                                className="text-orange-500 fill-orange-500"
                            />

                        </div>

                        <div>

                            <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                Favorite Tours
                            </h1>

                            <p className="text-sm text-slate-500 mt-0.5">
                                Saved tours you may want to book later
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {favorites.length < 1 ? (

                    <div className="bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">

                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">

                            <Heart
                                size={34}
                                className="text-orange-500"
                            />

                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            No favorites yet
                        </h2>

                        <p className="mt-2 text-slate-500 max-w-md leading-relaxed">
                            Explore tours and save the ones you love.
                            Your favorite destinations will appear here.
                        </p>

                        <button
                            onClick={() => navigate("/search")}
                            className="mt-6 h-11 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white text-sm font-bold shadow-lg shadow-orange-500/20"
                        >
                            Explore Tours
                        </button>

                    </div>

                ) : (

                    <div>

                        {/* TOP INFO */}
                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Saved Tours
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    {favorites.length} saved tours
                                </p>

                            </div>
                        </div>

                        {/* LIST */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">

                            {favorites.map(item => (

                                <Card
                                    key={item.id}
                                    item={item}

                                />

                            ))}

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}