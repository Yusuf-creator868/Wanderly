import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import maldives from '../assets/maldives.webp'
import turkey from '../assets/turkey.jpg'
import dubai from '../assets/dubai.webp'
import bali from '../assets/bali.jpg'
import thailand from '../assets/thailand.jpg'
import iceland from '../assets/iceland.jpg'

export function DestinationsSection() {
  const destinations = [
    { name: 'Maldives', tours: 234, image: maldives },
    { name: 'Turkey', tours: 189, image: turkey },
    { name: 'Dubai', tours: 267, image: dubai },
    { name: 'Bali', tours: 312, image: bali },
    { name: 'Thailand', tours: 298, image: thailand },
    { name: 'Iceland', tours: 156, image: iceland },
  ]

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
            <p className="text-sm font-semibold text-amber-900">
              Explore Destinations
            </p>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
            World&apos;s Most Sought-After Destinations
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl">
            Experience the world&apos;s most beautiful places with curated travel experiences
          </p>
        </motion.div>

        {/* 2 rows × 3 columns grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {destinations.map((d) => (
            <motion.div
              key={d.name}
              variants={item}
              className="group relative overflow-hidden rounded-2xl h-72 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <img
                src={d.image}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">{d.name}</h3>
                <p className="text-sm text-white/80">{d.tours} tours</p>

                <motion.div className="mt-3 inline-flex items-center gap-2 text-amber-400 font-semibold">
                  <span>Explore</span>
                  <ArrowRight size={20} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}