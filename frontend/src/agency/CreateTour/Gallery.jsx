import { useState } from "react";
import { ImagePlus, MapPin, Calendar, Users, FileUp, DollarSign, Plus, ChevronRight, ChevronLeft, Upload, Check, } from "lucide-react";
import api, { MAIN_URL } from "../../api";



export default function Gallery({ tourGallary, setTourGallery, uploadGallery, showSuccess }) {


    const handleCoverUpload = (e) => {
        const file = e.target.files[0]

        setTourGallery({
            ...tourGallary,
            cover_image: file
        })


    }

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files)

        setTourGallery({
            ...tourGallary,
            images: [...tourGallary.images, ...files]
        })
    }

    const removeTourImage = async (indexToRemove) => {

        const imageToRemove = tourGallary.images[indexToRemove]

        // EXISTING IMAGE (has an id from the server) -> delete via API
        if (imageToRemove?.id) {

            try {
                await api.delete(`/tour-images/${imageToRemove.id}/delete/`)
            } catch (err) {
                console.log(err.message)
                return // don't remove from UI if the API call failed
            }
        }

        // remove from local state either way (covers both existing + new/File images)
        setTourGallery({
            ...tourGallary,
            images: tourGallary.images.filter(
                (_, index) => index !== indexToRemove
            )
        })
    }


    return (
        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Tour Gallery
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Upload beautiful visuals of your experience
                    </p>
                </div>

                <button
                    type="button"
                    onClick={uploadGallery}
                    className=" mt-5 w-full sm:w-auto h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                >
                    Upload
                    <FileUp size={18} />
                </button>
            </div>

            <div className="space-y-8">

                {/* COVER IMAGE */}
                <div>
                    <label className="block mb-3 text-sm font-semibold text-slate-700">
                        Cover Image
                    </label>

                    <label
                        className="relative border-2 border-dashed border-amber-300 rounded-3xl h-80 bg-amber-50/40 flex flex-col items-center justify-center text-center hover:bg-amber-50 transition cursor-pointer overflow-hidden">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                        />

                        {tourGallary.cover_image ? (
                            <img
                                src={typeof tourGallary.cover_image === 'string' ?
                                    `${tourGallary.cover_image}` :
                                    URL.createObjectURL(tourGallary.cover_image)}
                                alt="Cover"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <ImagePlus
                                    className="text-amber-500 mb-4"
                                    size={44}
                                />

                                <h3 className="font-semibold text-slate-800 text-lg">
                                    Upload Cover Image
                                </h3>

                                <p className="text-slate-500 text-sm mt-2">
                                    PNG, JPG up to 10MB
                                </p>
                            </>
                        )}
                    </label>
                </div>

                {/* GALLERY */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-slate-700">
                            Gallery Images
                        </label>

                        <label
                            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white font-medium flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={18} />

                            Add Images

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                        {/* Uploaded Images */}
                        {tourGallary.images.map((image, index) => {

                            const isExisting = image?.id !== undefined

                            const src = isExisting
                                ? `${image.image}`
                                : URL.createObjectURL(image)

                            return (
                                <div
                                    key={isExisting ? image.id : index}
                                    className="relative aspect-square rounded-2xl overflow-hidden group"
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeTourImage(index)}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            )
                        })}

                        {/* Upload Box */}
                        <label
                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40 transition flex flex-col items-center justify-center cursor-pointer"
                        >
                            <Upload
                                className="text-slate-400 mb-2"
                                size={28}
                            />

                            <span className="text-sm text-slate-500">
                                Upload
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryUpload}
                                className="hidden"
                            />
                        </label>
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