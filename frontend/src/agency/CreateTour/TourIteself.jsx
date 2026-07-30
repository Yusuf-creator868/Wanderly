import { useState } from "react";
import {
    ImagePlus, MapPin, Calendar, FileUp, DollarSign, Plus, ChevronRight, PlaneTakeoff,
    MapPinned,
    ChevronLeft, Upload, Check, Globe, Map,
    Type,
    LayoutGrid,
    Clock3,
    Users,
    BadgeDollarSign,
    FileText,
    Moon,
    Sun 
} from "lucide-react";
import api from "../../api";





export default function TourItself({ tourData, setTourData, createTour, showSuccess }) {



    const updateField = (e) => {

        const { name, value } = e.target

        setTourData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }






    return (

        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Basic Information
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Start with the core details of your tour
                    </p>
                </div>

                <button
                    type="button"
                    onClick={createTour}
                    className=" mt-5 w-full sm:w-auto h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                >
                    Upload
                    <FileUp size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* TITLE */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700"> Tour Title </label>
                    <div className="relative">
                        <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                        <input type="text" name="title" value={tourData.title} onChange={updateField} placeholder="Luxury Dubai Experience" className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition" />
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Tour Description
                    </label>

                    <div className="relative">
                        <FileText
                            size={18}
                            className="absolute left-4 top-5 text-orange-500"
                        />

                        <textarea
                            name="description"
                            value={tourData.description}
                            onChange={updateField}
                            rows={6}
                            placeholder="Describe the experience, activities, hotel, food, transportation and important details..."
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-5 py-4 outline-none focus:border-orange-500 transition resize-none"
                        />
                    </div>
                </div>


                {/* LOCATIONS */}
                <div className="md:col-span-2">

                    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/60">

                        {/* HEADER */}
                        <div className="flex items-center gap-2 mb-5">

                            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">

                                <PlaneTakeoff
                                    size={18}
                                    className="text-orange-600"
                                />

                            </div>

                            <div>

                                <h3 className="text-sm font-bold text-slate-900">
                                    Tour Route
                                </h3>

                                <p className="text-xs text-slate-500 mt-0.5">
                                    Departure and destination information
                                </p>

                            </div>
                        </div>

                        {/* INPUTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* DEPARTURE COUNTRY */}
                            <div>

                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Departure Country
                                </label>

                                <div className="relative">

                                    <MapPinned
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        name="from_country"
                                        value={tourData.from_country}
                                        onChange={updateField}
                                        placeholder="United Arab Emirates"
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition"
                                    />
                                </div>
                            </div>

                            {/* DEPARTURE CITY */}
                            <div>

                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Departure City
                                </label>

                                <div className="relative">

                                    <MapPin
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        name="from_city"
                                        value={tourData.from_city}
                                        onChange={updateField}
                                        placeholder="Dubai"
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition"
                                    />
                                </div>
                            </div>

                            {/* DESTINATION COUNTRY */}
                            <div>

                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Destination Country
                                </label>

                                <div className="relative">

                                    <Globe
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        name="country"
                                        value={tourData.country}
                                        onChange={updateField}
                                        placeholder="Turkey"
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition"
                                    />
                                </div>
                            </div>

                            {/* DESTINATION CITY */}
                            <div>

                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Destination City
                                </label>

                                <div className="relative">

                                    <Map
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        name="city"
                                        value={tourData.city}
                                        onChange={updateField}
                                        placeholder="Istanbul"
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* DURATION */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Days
                    </label>

                    <div className="relative">
                        <Sun 
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        />

                        <input
                            type="number"
                            name="duration"
                            value={tourData.duration}
                            onChange={updateField}
                            onWheel={(e) => e.target.blur()}
                            placeholder="7"
                            className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition"
                        />
                    </div>
                </div>

                {/* Nights */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Nights
                    </label>

                    <div className="relative">
                        <Moon 
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        />

                        <input
                            type="number"
                            name="nights"
                            value={tourData.nigths}
                            onChange={updateField}
                            onWheel={(e) => e.target.blur()}
                            placeholder="7"
                            className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition"
                        />
                    </div>
                </div>

                {/* CATEGORY */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Tour Category
                    </label>

                    <div className="relative">
                        <LayoutGrid
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 z-10"
                        />

                        <select
                            name="category"
                            value={tourData.category}
                            onChange={updateField}
                            className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-5 outline-none focus:border-orange-500 transition appearance-none"
                        >
                            <option value="">
                                Select category
                            </option>

                            <option value="luxury">
                                Luxury
                            </option>

                            <option value="adventure">
                                Adventure
                            </option>

                            <option value="beach">
                                Beach
                            </option>

                            <option value="honeymoon">
                                Honeymoon
                            </option>

                            <option value="family">
                                Family
                            </option>

                            <option value="cultural">
                                Cultural
                            </option>
                        </select>
                    </div>
                </div>

              


                {/* FEATURES */}
                <div className="md:col-span-2">
                    <label className="block mb-4 text-sm font-semibold text-slate-700">
                        Tour Features
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* FLIGHT */}
                        <label className="flex items-center justify-between border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-amber-400 transition">
                            <span className="text-slate-700 font-medium">
                                Flight Included
                            </span>

                            <input
                                type="checkbox"
                                name="flight_included"
                                checked={tourData.flight_included}
                                onChange={(e) =>
                                    setTourData((prev) => ({
                                        ...prev,
                                        flight_included: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5 accent-amber-500"
                            />
                        </label>

                        {/* MEALS */}
                        <label className="flex items-center justify-between border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-amber-400 transition">
                            <span className="text-slate-700 font-medium">
                                Meals Included
                            </span>

                            <input
                                type="checkbox"
                                name="meals_included"
                                checked={tourData.meals_included}
                                onChange={(e) =>
                                    setTourData((prev) => ({
                                        ...prev,
                                        meals_included: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5 accent-amber-500"
                            />
                        </label>

                        {/* HOTEL */}
                        <label className="flex items-center justify-between border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-amber-400 transition">
                            <span className="text-slate-700 font-medium">
                                Hotel Included
                            </span>

                            <input
                                type="checkbox"
                                name="hotel_included"
                                checked={tourData.hotel_included}
                                onChange={(e) =>
                                    setTourData((prev) => ({
                                        ...prev,
                                        hotel_included: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5 accent-amber-500"
                            />
                        </label>

                        {/* CAR */}
                        <label className="flex items-center justify-between border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-amber-400 transition">
                            <span className="text-slate-700 font-medium">
                                Car Included
                            </span>

                            <input
                                type="checkbox"
                                name="car"
                                checked={tourData.car}
                                onChange={(e) =>
                                    setTourData((prev) => ({
                                        ...prev,
                                        car: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5 accent-amber-500"
                            />
                        </label>

                        {/* GUIDE */}
                        <label className="flex items-center justify-between border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-amber-400 transition">
                            <span className="text-slate-700 font-medium">
                                Guide Included
                            </span>

                            <input
                                type="checkbox"
                                name="guide_included"
                                checked={tourData.guide_included}
                                onChange={(e) =>
                                    setTourData((prev) => ({
                                        ...prev,
                                        guide_included: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5 accent-amber-500"
                            />
                        </label>

                    </div>
                </div>

                {/* INCLUDED ITEMS */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-slate-700">
                            Included Items
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setTourData((prev) => ({
                                    ...prev,
                                    included_items: [
                                        ...prev.included_items,
                                        "",
                                    ],
                                }))
                            }
                            className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
                        >
                            <Plus size={16} />
                            Add Included
                        </button>
                    </div>

                    <div className="space-y-3">
                        {tourData.included_items.map((item, index) => (
                            <div key={index} className="flex gap-3">

                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                        const updated = [...tourData.included_items]
                                        updated[index] = e.target.value

                                        setTourData((prev) => ({
                                            ...prev,
                                            included_items: updated,
                                        }))
                                    }}
                                    placeholder="Breakfast Included"
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        const filtered =
                                            tourData.included_items.filter(
                                                (_, i) => i !== index
                                            )

                                        setTourData((prev) => ({
                                            ...prev,
                                            included_items: filtered,
                                        }))
                                    }}
                                    className="px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EXCLUDED ITEMS */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-slate-700">
                            Excluded Items
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setTourData((prev) => ({
                                    ...prev,
                                    excluded_items: [
                                        ...prev.excluded_items,
                                        "",
                                    ],
                                }))
                            }
                            className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
                        >
                            <Plus size={16} />
                            Add Excluded
                        </button>
                    </div>

                    <div className="space-y-3">
                        {tourData.excluded_items.map((item, index) => (
                            <div key={index} className="flex gap-3">

                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                        const updated = [...tourData.excluded_items]
                                        updated[index] = e.target.value

                                        setTourData((prev) => ({
                                            ...prev,
                                            excluded_items: updated,
                                        }))
                                    }}
                                    placeholder="Visa Fees"
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        const filtered =
                                            tourData.excluded_items.filter(
                                                (_, i) => i !== index
                                            )

                                        setTourData((prev) => ({
                                            ...prev,
                                            excluded_items: filtered,
                                        }))
                                    }}
                                    className="px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>



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