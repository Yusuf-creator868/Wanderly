import { motion } from 'framer-motion'
import { Heart, MapPin, Clock, Users, Star } from 'lucide-react'
import { useState } from 'react'

import maldives from '../assets/maldives.webp'
import turkey from '../assets/turkey.jpg'
import dubai from '../assets/dubai.webp'
import bali from '../assets/bali.jpg'
import thailand from '../assets/thailand.jpg'
import iceland from '../assets/iceland.jpg'

export function ToursSection() {
    const [liked, setLiked] = useState(new Set())

    const tours = [
        {
            id: '1',
            title: 'Private Yacht Cruise',
            country: 'Maldives',
            duration: '5 days',
            price: 2499,
            seats: 4,
            rating: 4.9,
            reviews: 342,
            image: maldives
        },
        {
            id: '2',
            title: 'Istanbul Cultural Tour',
            country: 'Turkey',
            duration: '3 days',
            price: 899,
            seats: 12,
            rating: 4.8,
            reviews: 527,
            image: turkey
        },
        {
            id: '3',
            title: 'Desert Safari Experience',
            country: 'Dubai',
            duration: '2 days',
            price: 599,
            seats: 20,
            rating: 4.7,
            reviews: 891,
            image: dubai
        },
        {
            id: '4',
            title: 'Bali Temple & Nature',
            country: 'Bali',
            duration: '4 days',
            price: 699,
            seats: 8,
            rating: 4.9,
            reviews: 1203,
            image: bali
        },
        {
            id: '5',
            title: 'Bangkok Street Food Tour',
            country: 'Thailand',
            duration: '2 days',
            price: 399,
            seats: 15,
            rating: 4.8,
            reviews: 756,
            image: thailand
        },
        {
            id: '6',
            title: 'Northern Lights Expedition',
            country: 'Iceland',
            duration: '6 days',
            price: 1899,
            seats: 6,
            rating: 5.0,
            reviews: 432,
            image: iceland
        },
    ]

    const toggleLike = (id) => {
        const updated = new Set(liked)
        updated.has(id) ? updated.delete(id) : updated.add(id)
        setLiked(updated)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    }

    return (
        <section id="tours" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
                        <p className="text-sm font-semibold text-amber-900">Featured Experiences</p>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
                        Trending <span className="text-amber-600">Tours & Experiences</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Discover the most booked and highly-rated premium experiences from our verified partners
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {tours.map((tour) => (
                        <motion.div
                            key={tour.id}
                            variants={itemVariants}
                            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden h-56 bg-slate-200">
                                <img
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    src={tour.image}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />

                                {/* Like button */}
                                <motion.button
                                    onClick={() => toggleLike(tour.id)}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition shadow-md"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Heart
                                        size={20}
                                        className={`transition-colors ${liked.has(tour.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
                                    />
                                </motion.button>

                                {/* Badge */}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">
                                    Featured
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{tour.title}</h3>
                                            <div className="flex items-center gap-1 text-slate-600 text-sm mt-1">
                                                <MapPin size={14} />
                                                {tour.country}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={`${i < Math.floor(tour.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">{tour.rating}</span>
                                        <span className="text-xs text-slate-500">({tour.reviews} reviews)</span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock size={14} />
                                            <span>{tour.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users size={14} />
                                            <span className="text-amber-600 font-medium">{tour.seats} seats available</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-slate-500 font-medium">From</span>
                                        <div className="text-2xl font-bold text-amber-600">${tour.price}</div>
                                    </div>
                                    <motion.button
                                        className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition shadow-md"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Book Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}