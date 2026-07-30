import { useState } from "react";
import { ImagePlus, MapPin, Calendar, Users, DollarSign, FileUp, Plus, ChevronRight, ChevronLeft, Upload, Check, } from "lucide-react";
import api from "../../api";



export default function PriceDep({ priceDep, setpriceDep, showSuccess, createDepartures }) {




    const addDeparture = () => {
        setpriceDep((prev) => [
            ...prev,
            {
                departure_date: "",
                available_seats: "",
                price: "",
            },
        ])
    }

    const removeDeparture = async (index) => {

        const departureToRemove = priceDep[index]

        // EXISTING DEPARTURE (has id from server) -> delete via API first
        if (departureToRemove?.id) {
            try {
                await api.delete(`/departures/${departureToRemove.id}/delete/`)
            } catch (err) {
                console.log(err.message)
                return // don't remove from UI if delete failed
            }
        }

        const updated = priceDep.filter(
            (_, i) => i !== index
        )

        setpriceDep(updated)
    }

    const handleDepartureChange = (e, index) => {
        const { name, value } = e.target
        const updated = [...priceDep]

        updated[index][name] = value

        setpriceDep(updated)
    }

    return (
        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Pricing & Departures
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Set departure dates, seats, and pricing
                    </p>
                </div>

                <button
                    type="button"
                    onClick={createDepartures}
                    className=" mt-5 w-full sm:w-auto h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                >
                    Upload
                    <FileUp size={18} />
                </button>
            </div>

            <div className="space-y-5">

                {priceDep.map((departure, index) => (
                    <div
                        key={index}
                        className=" border border-slate-200 rounded-3xl p-6 bg-white hover:border-amber-300 transition "
                    >
                        <div className="flex items-center justify-between mb-6">

                            <div className="flex items-center gap-3">
                                <div
                                    className=" w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold "
                                >
                                    {index + 1}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900">
                                    Departure {index + 1}
                                </h3>
                            </div>

                            {priceDep.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeDeparture(index)
                                    }
                                    className=" text-sm text-red-500 hover:text-red-600 transition "
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            {/* DATE */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Departure Date
                                </label>

                                <input
                                    type="date"
                                    name="departure_date"
                                    value={departure.departure_date}
                                    onChange={(e) => handleDepartureChange(e, index)}
                                    className=" w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition "
                                />
                            </div>

                            {/* DEPARTURE TIME */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Departure Time
                                </label>

                                <input
                                    type="time"
                                    name="departure_time"
                                    value={departure.departure_time}
                                    onChange={(e) => handleDepartureChange(e, index)}
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* RETURN DATE */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Return Date
                                </label>

                                <input
                                    type="date"
                                    name="return_date"
                                    value={departure.return_date}
                                    onChange={(e) => handleDepartureChange(e, index)}
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* RETURN TIME */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Return Time
                                </label>

                                <input
                                    type="time"
                                    name="return_time"
                                    value={departure.return_time}
                                    onChange={(e) => handleDepartureChange(e, index)}
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* SEATS */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Available Seats
                                </label>

                                <input
                                    type="number"
                                    name="available_seats"
                                    value={departure.available_seats}
                                    onChange={(e) => handleDepartureChange(e, index)}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="20"
                                    className=" w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition "
                                />
                            </div>

                            {/* PRICE */}
                           
                        </div>
                    </div>
                ))}

                {/* ADD BUTTON */}
                <button
                    type="button"
                    onClick={addDeparture}
                    className=" w-full h-16 rounded-2xl border-2 border-dashed border-amber-300 text-amber-600 font-semibold hover:bg-amber-50 transition flex items-center justify-center gap-2 "
                >
                    <Plus size={20} />

                    Add Departure
                </button>
            </div>

            {showSuccess && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-lg animate-bounce">
                        <Check size={18} />
                        Uploaded Successfully
                    </div>
                </div>
            )}
        </div>
    )
}