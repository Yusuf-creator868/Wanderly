import { useState } from "react";
import { ImagePlus, MapPin, Calendar, Users, DollarSign, FileUp, Plus, ChevronRight, ChevronLeft, Upload, Check, } from "lucide-react";
import api from "../../api";



export default function Itinerary({ itinerary, setItinerary, showSuccess, createItinerary }) {


    //   Step Itinerary --------->
    const addNewDay = () => {
        setItinerary((prev) => ([
            ...prev,
            {
                day_number: prev.length + 1,
                title: "",
                description: "",
            },

        ]))
    }

    const removeDay = async (index) => {

        const dayToRemove = itinerary[index]

        // EXISTING DAY (has id from server) -> delete via API first
        if (dayToRemove?.id) {
            try {
                await api.delete(`/itinerary/${dayToRemove.id}/delete/`)
            } catch (err) {
                console.log(err.message)
                return // don't remove from UI if delete failed
            }
        }

        const updated = [...itinerary]

        updated.splice(index, 1)

        const reordered = updated.map((item, i) => ({
            ...item,
            day_number: i + 1,
        }))

        
        for (const day of reordered) {
            if (day.id) {
                await api.patch(`/itinerary/${day.id}/`, day)
            }
        }

        setItinerary(reordered)
    }


    const handleDayChange = (e, index) => {

        const { name, value } = e.target

        const updated = [...itinerary]

        updated[index][name] = value

        setItinerary(updated)
    }

    return (
        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Tour Itinerary
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Create a day-by-day travel experience
                    </p>
                </div>

                <button
                    type="button"
                    onClick={createItinerary}
                    className=" mt-5 w-full sm:w-auto h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                >
                    Upload
                    <FileUp size={18} />
                </button>
            </div>

            <div className="space-y-5">

                {itinerary.map((day, index) => (
                    <div
                        key={index}
                        className=" border border-slate-200 rounded-3xl p-6 bg-white hover:border-amber-300 transition "
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div
                                    className=" w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold "
                                >
                                    {index + 1}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900">
                                    Day {index + 1}
                                </h3>
                            </div>

                            {itinerary.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeDay(index)}
                                    className=" text-sm text-red-500 hover:text-red-600 transition "
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name='title'
                                value={day.title}
                                onChange={(e) => handleDayChange(e, index)}
                                placeholder="Arrival & Hotel Check-in"
                                className=" w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition "
                            />

                            <textarea
                                rows={5}
                                value={day.description}
                                name='description'
                                onChange={(e) => handleDayChange(e, index)}
                                placeholder="Describe the day's activities..."
                                className=" w-full h-20 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition "
                            />
                        </div>
                    </div>
                ))}

                {/* ADD BUTTON */}
                <button
                    type="button"
                    onClick={addNewDay}
                    className=" w-full h-16 rounded-2xl border-2 border-dashed border-amber-300 text-amber-600 font-semibold hover:bg-amber-50 transition flex items-center justify-center gap-2 "
                >
                    <Plus size={20} />

                    Add New Day
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