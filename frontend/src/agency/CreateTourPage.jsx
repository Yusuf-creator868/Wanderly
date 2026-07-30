import { useEffect, useState } from "react";
import { ImagePlus, MapPin, Calendar, Users, DollarSign, Plus, ChevronRight, ChevronLeft, Upload, Check, } from "lucide-react";
import api from "../api";
import TourItself from "./CreateTour/TourIteself";
import Gallery from "./CreateTour/Gallery";
import CreateHotel from "./CreateTour/CreateHotel";
import Itinerary from "./CreateTour/Itinerary";
import PriceDep from "./CreateTour/PriceDep";
import { useParams, useLocation } from 'react-router-dom'

export default function CreateTourPage() {

    const [step, setStep] = useState(1);
    const { id } = useParams()
    const location = useLocation()
    const [showSuccess, setShowSuccess] = useState(false);
    const isUpdateMode = location.pathname.includes('update')



    const [tourData, setTourData] = useState({
        title: "",
        description: "",

        from_country: "",
        from_city: "",

        country: "",
        city: "",

        category: "luxury",
        nights: '',
        duration: "",


        flight_included: false,
        meals_included: false,
        hotel_included: true,
        car: false,
        guide_included: false,


        included_items: [],
        excluded_items: [],


    })

    const [tourGallary, setTourGallery] = useState({

        cover_image: null,

        images: [],


    })

    const [hotelData, sethotelData] = useState(
        [
            {
                name: "",
                stars: "",
                room_type: "",
                meal_plan: "",
                price: '',
                description: "",
                images: [],
            },
        ]
    )

    // const [itinerary, setItinerary] = useState(
    //     [
    //         {
    //             day_number: 1,
    //             title: "",
    //             description: "",
    //         },
    //     ],
    // )

    const [priceDep, setpriceDep] = useState(
        [
            {
                departure_date: "",
                departure_time: "",
                return_date: "",
                return_time: "",
                available_seats: "",

            },
        ],
    )



    const steps = [
        "Basic",
        "Gallery",
        "Hotel",
        "Pricing",
        ...(!isUpdateMode ? ["Publish"] : []),
    ];




    const createTour = async () => {

        const formData = new FormData()

        // BASIC INFO
        formData.append("title", tourData.title)
        formData.append("description", tourData.description)
        formData.append("from_country", tourData.from_country)
        formData.append("from_city", tourData.from_city)
        formData.append("country", tourData.country)
        formData.append("city", tourData.city)
        formData.append("category", tourData.category)
        formData.append("nights", tourData.nights)
        formData.append("duration", tourData.duration)

        // FEATURES
        formData.append(
            "flight_included",
            tourData.flight_included
        )

        formData.append(
            "meals_included",
            tourData.meals_included
        )

        formData.append(
            "hotel_included",
            tourData.hotel_included
        )

        formData.append(
            "car",
            tourData.car
        )

        formData.append(
            "guide_included",
            tourData.guide_included
        )

        formData.append(
            "included_items",
            JSON.stringify(
                tourData.included_items.map((item) => ({
                    title: item
                }))
            )
        )

        formData.append(
            "excluded_items",
            JSON.stringify(
                tourData.excluded_items.map((item) => ({
                    title: item
                }))
            )
        )

        // COVER IMAGE
        if (tourData.cover_image) {

            formData.append(
                "cover_image",
                tourData.cover_image
            )

        }

        await api.patch(`/tour_info/${id}/`, formData)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err.message)
            })

        setShowSuccess(true)

        setTimeout(() => {
            setShowSuccess(false)
        }, 2500)

    }

    const uploadGallery = async () => {

        const formData = new FormData()

        if (tourGallary.cover_image) {
            formData.append(
                "cover_image",
                tourGallary.cover_image
            )
        }

        tourGallary.images.forEach((img) => {
            formData.append("images", img)
        })

        await api.patch(
            `/upload_images/${id}/`,
            formData
        )

        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    }



    const createHotels = async () => {

        for (const hotel of hotelData) {

            const formData = new FormData()

            formData.append("name", hotel.name)
            formData.append("stars", hotel.stars)
            formData.append("price", hotel.price)
            formData.append("room_type", hotel.room_type)
            formData.append("meal_plan", hotel.meal_plan)
            formData.append("description", hotel.description)

            hotel.images.forEach((image) => {
                formData.append("images", image)
            })

            if (hotel.id) {
                await api.patch(`/hotels/${hotel.id}/`, formData)
            } else {

                await api.post(`/create_hotel/${id}/`, formData)
            }
        }

        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    }



    const createItinerary = async () => {

        for (const item of itinerary) {

            if (item.id) {
                // EXISTING -> UPDATE
                await api.patch(`/itinerary/${item.id}/`, item)
            } else {
                // NEW -> CREATE
                await api.post(`/create_itinerary/${id}/`, item)
            }
        }

        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    }

    const createDepartures = async () => {

        for (const item of priceDep) {

            if (item.id) {
                // EXISTING -> UPDATE
                await api.patch(`/departures/${item.id}/`, item)
            } else {
                // NEW -> CREATE
                await api.post(`/create_departure/${id}/`, item)
            }
        }

        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    }

    const publish_tour = async () => {
        await api.post(`/publish_tour/${id}/publish/`)

        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    }


    useEffect(() => {
        fetchTour()
    }, [])


    const fetchTour = async () => {

        try {

            const res = await api.get(`get_tour/${id}/`)
            console.log(res.data)
            const data = res.data

            // ------------------------
            // TOUR INFO
            // ------------------------

            setTourData({
                title: data.title || "",
                description: data.description || "",

                from_country: data.from_country || "",
                from_city: data.from_city || "",

                country: data.country || "",
                city: data.city || "",

                category: data.category || "luxury",

                nights: data.nights || "",
                duration: data.duration || "",
                total_seats: data.total_seats || "",

                flight_included: data.flight_included || false,
                meals_included: data.meals_included || false,
                hotel_included: data.hotel_included || false,
                car: data.car || false,
                guide_included: data.guide_included || false,


                included_items: data.included_items?.map(
                    item => item.title
                ) || [],

                excluded_items: data.excluded_items?.map(
                    item => item.title
                ) || [],


            })

            // ------------------------
            // GALLERY
            // ------------------------

            setTourGallery({
                cover_image: data.cover_image || null,

                images: data.images || [],


            })

            // ------------------------
            // HOTELS
            // ------------------------


            sethotelData(
                data.hotels.map(hotel => ({
                    ...hotel,
                    images: hotel.images || [] // keep {id, image} objects
                }))
            )



            // ------------------------
            // ITINERARY
            // ------------------------


            // setItinerary(
            //     data.itinerary?.length
            //         ? data.itinerary.map(item => ({
            //             id: item.id,
            //             day_number: item.day_number || 1,
            //             title: item.title || "",
            //             description: item.description || "",
            //         }))
            //         : [
            //             {
            //                 day_number: 1,
            //                 title: "",
            //                 description: "",
            //             },
            //         ]
            // )



            // ------------------------
            // DEPARTURES
            // ------------------------


            setpriceDep(
                data.departures?.length
                    ? data.departures.map(item => ({
                        id: item.id,
                        departure_date: item.departure_date || "",
                        departure_time: item.departure_time || "",
                        return_date: item.return_date || "",
                        return_time: item.return_time || "",
                        available_seats: item.available_seats || "",
                    }))
                    : [
                        {
                            departure_date: "",
                            departure_time: "",
                            return_date: "",
                            return_time: "",
                            available_seats: "",

                        },
                    ]
            )


        } catch (err) {

            console.log(err)

        }
    }






    const prevStep = () => {

        if (step > 1) {
            setStep((prev) => prev - 1)
        }
    }

    return (
        <form className="min-h-screen bg-[#f8fafc] text-black p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        {isUpdateMode ? "Update Tour" : "Create New Tour"}
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Build premium travel experiences for your travelers
                    </p>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-6">
                    {/* SIDEBAR STEPS */}
                    <div
                        className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-5 overflow-x-auto lg:sticky lg:top-24 h-fit"
                    >
                        {/* MOBILE */}
                        <div className="flex lg:hidden gap-3 min-w-max">
                            {steps.map((item, index) => {
                                const current = index + 1

                                return (
                                    <div
                                        key={item}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all duration-300

                                            ${step === current
                                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                                : step > current
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-slate-50 text-slate-500"
                                            }
                    `}
                                    >
                                        <div
                                            className={` w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold

                                            ${step === current
                                                    ? "bg-white/20"
                                                    : step > current
                                                        ? "bg-amber-500 text-white"
                                                        : "bg-white"
                                                }
                        `}
                                        >
                                            {step > current ? (
                                                <Check size={16} />
                                            ) : (
                                                current
                                            )}
                                        </div>

                                        <span className="text-sm font-semibold">
                                            {item}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden lg:flex flex-col space-y-3">
                            {steps.map((item, index) => {
                                const current = index + 1

                                return (
                                    <div
                                        key={item}
                                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300

                                        ${step === current
                                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                                : step > current
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-slate-50 text-slate-500"
                                            }`}>
                                        <div
                                            className={` w-10 h-10 rounded-xl flex items-center justify-center font-bold

                                            ${step === current
                                                    ? "bg-white/20"
                                                    : step > current
                                                        ? "bg-amber-500 text-white"
                                                        : "bg-white"
                                                }`}>
                                            {step > current ? (
                                                <Check size={18} />
                                            ) : (
                                                current
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {item}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>




                    {/* CONTENT */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8">
                        {/* STEP 1 */}
                        {step === 1 && (
                            <TourItself tourData={tourData} setTourData={setTourData} createTour={createTour} showSuccess={showSuccess} />
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <Gallery tourGallary={tourGallary} setTourGallery={setTourGallery} uploadGallery={uploadGallery} showSuccess={showSuccess} />
                        )}


                        {/* STEP 3 */}
                        {step === 3 && (
                            <CreateHotel hotelData={hotelData} sethotelData={sethotelData} createHotels={createHotels} showSuccess={showSuccess} />
                        )}



                        {/* STEP 4 */}
                        {/* {step === 4 && (
                            <Itinerary itinerary={itinerary} setItinerary={setItinerary} createItinerary={createItinerary} showSuccess={showSuccess} />
                        )} */}


                        {/* STEP 5 */}
                        {step === 4 && (
                            <PriceDep priceDep={priceDep} setpriceDep={setpriceDep} createDepartures={createDepartures} showSuccess={showSuccess} />
                        )}






                        {/* STEP 6 */}
                        {!isUpdateMode && step === steps.length && (
                            <div className="text-center py-10">
                                <div
                                    className=" w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6 "
                                >
                                    <Check
                                        className="text-amber-500"
                                        size={42}
                                    />
                                </div>

                                <h2 className="text-3xl font-bold text-slate-900">
                                    Ready to Publish
                                </h2>

                                <p className="text-slate-500 mt-4 max-w-xl mx-auto">
                                    Your premium travel experience is ready to
                                    go live on Wanderly.
                                </p>

                                <button
                                    onClick={publish_tour}
                                    type="button"
                                    className=" mt-8 h-14 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 "
                                >
                                    Publish Tour
                                </button>
                            </div>
                        )}






                        {/* FOOTER NAV */}
                        <div className=" flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-slate-200 "
                        >
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className=" w-full sm:w-auto h-12 px-5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                            >
                                <ChevronLeft size={18} />
                                Previous
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep((prev) => prev + 1)}
                                disabled={step === 6}
                                className=" w-full sm:w-auto h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 "
                            >
                                Next Step
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-lg animate-bounce">
                        <Check size={18} />
                        Published Successfully
                    </div>
                </div>
            )}
        </form>
    );
}