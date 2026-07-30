import { useState } from "react";
import { ImagePlus, MapPin, Calendar, Users, DollarSign, FileUp, Plus, ChevronRight, ChevronLeft, Upload, Check, } from "lucide-react";
import api, { MAIN_URL } from "../../api";



export default function CreateHotel({ hotelData, sethotelData, createHotels, showSuccess }) {



    const updateHotelField = (e, index) => {

        const { name, value } = e.target
        const updatedHotels = [...hotelData]

        updatedHotels[index][name] = value

        sethotelData(updatedHotels)
    }



    const handleHotelImages = (e, index) => {
        const files = Array.from(e.target.files)

        const updateHotels = [...hotelData]

        updateHotels[index].images = [
            ...updateHotels[index].images,
            ...files,
        ]

        sethotelData(updateHotels)

    }

    const removeHotelImage = async (hotelIndex, imageIndex) => {

        const imageToRemove = hotelData[hotelIndex].images[imageIndex]

        // EXISTING IMAGE (has id from server) -> delete via API first
        if (imageToRemove?.id) {
            try {
                await api.delete(`/hotel-images/${imageToRemove.id}/delete/`)
            } catch (err) {
                console.log(err.message)
                return // don't remove from UI if delete failed
            }
        }

        const updatedHotels = [...hotelData]

        updatedHotels[hotelIndex].images = updatedHotels[hotelIndex].images.filter(
            (_, i) => i !== imageIndex
        )

        sethotelData(updatedHotels)
    }


    return (
        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Hotel & Inclusions
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Add accommodation details and what's included
                    </p>
                </div>
                <button
                    type="button"
                    onClick={createHotels}
                    className=" mt-5 w-full sm:w-auto h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                >
                    Upload
                    <FileUp size={18} />
                </button>
            </div>

            <div className="space-y-8">

                {/* HOTELS */}
                {hotelData.map((hotel, index) => (
                    <div
                        key={index}
                        className="border border-slate-200 rounded-3xl p-6 bg-white space-y-6"
                    >

                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Hotel {index + 1}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Add hotel information and photos
                                </p>
                            </div>

                            {hotelData.length > 1 && (
                                <button
                                    type="button"
                                    onClick={async () => {

                                        const hotelToRemove = hotelData[index]

                                        // EXISTING HOTEL (has id from server) -> delete via API first
                                        if (hotelToRemove?.id) {
                                            try {
                                                await api.delete(`/hotels/${hotelToRemove.id}/delete/`)
                                            } catch (err) {
                                                console.log(err.message)
                                                return // don't remove from UI if delete failed
                                            }
                                        }

                                        const updatedHotels = hotelData.filter(
                                            (_, i) => i !== index
                                        )

                                        sethotelData(updatedHotels)
                                    }}
                                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* HOTEL INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* NAME */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Hotel Name
                                </label>

                                <input
                                    type="text"
                                    name='name'
                                    value={hotel.name}
                                    onChange={(e) => updateHotelField(e, index)}
                                    placeholder="Riu Atoll Maldives"
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* STARS */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Hotel Rating
                                </label>

                                <input
                                    type="number"
                                    name="stars"
                                    value={hotel.stars}
                                    onChange={(e) => updateHotelField(e, index)}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="5"
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={hotel.price}
                                    onChange={(e) => updateHotelField(e, index)}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="5"
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* ROOM TYPE */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Room Type
                                </label>

                                <input
                                    type="text"
                                    name="room_type"
                                    value={hotel.room_type}
                                    onChange={(e) => updateHotelField(e, index)}
                                    placeholder="Ocean View Villa"
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            {/* MEAL PLAN */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Meal Plan
                                </label>

                                <select
                                    name="meal_plan"
                                    value={hotel.meal_plan}
                                    onChange={(e) => updateHotelField(e, index)}
                                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-amber-500 transition"
                                >
                                    <option value=""> Select Meal Plan </option>
                                    <option value="breakfast"> Breakfast Only </option>
                                    <option value="half_board"> Half Board </option>
                                    <option value="full_board"> Full Board </option>
                                    <option value="all_inclusive"> All Inclusive </option>
                                </select>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    rows={5}
                                    name="description"
                                    value={hotel.description}
                                    onChange={(e) => updateHotelField(e, index)}
                                    placeholder="Luxury beachfront resort with private villas..."
                                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-amber-500 transition resize-none"
                                />
                            </div>
                        </div>

                        {/* HOTEL IMAGES */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Hotel Photos
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Upload hotel images
                                    </p>
                                </div>

                                <label className="px-5 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white font-medium flex items-center gap-2 cursor-pointer">
                                    <Upload size={18} />

                                    Upload

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleHotelImages(e, index)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* EMPTY */}
                            {hotel.images.length === 0 && (
                                <label className="border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center text-center hover:border-amber-400 hover:bg-amber-50/40 transition cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleHotelImages(e, index)}
                                        className="hidden"
                                    />

                                    <ImagePlus
                                        className="text-amber-500 mb-4"
                                        size={42}
                                    />

                                    <h3 className="font-semibold text-slate-800 text-lg">
                                        Upload Hotel Images
                                    </h3>

                                    <p className="text-slate-500 text-sm mt-2">
                                        PNG, JPG, WEBP up to 10MB
                                    </p>
                                </label>
                            )}

                 
                            {/* IMAGES */}
                            {hotel.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {hotel.images.map((image, imageIndex) => {

                                        const isExisting = image?.id !== undefined

                                        const src = isExisting
                                            ? `${image.image}`
                                            : URL.createObjectURL(image)

                                        return (
                                            <div
                                                key={isExisting ? image.id : imageIndex}
                                                className="relative aspect-square rounded-2xl overflow-hidden group"
                                            >
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => removeHotelImage(index, imageIndex)}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* ADD HOTEL */}
                <button
                    type="button"
                    onClick={() => {
                        sethotelData((prev) => ([
                            ...prev,
                            {
                                name: "",
                                stars: "",
                                room_type: "",
                                meal_plan: "",
                                description: "",
                                images: [],
                            }
                        ]))
                    }}
                    className="w-full h-16 rounded-2xl border-2 border-dashed border-amber-300 text-amber-600 font-semibold hover:bg-amber-50 transition flex items-center justify-center gap-2"
                >
                    <Plus size={20} />

                    Add Hotel
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