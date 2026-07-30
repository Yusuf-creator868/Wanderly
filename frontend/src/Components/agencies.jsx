import { motion } from 'framer-motion'
import { CheckCircle2, Star } from 'lucide-react'

export function AgenciesSection() {
  const agencies = [
    {
      id: '1',
      name: 'Wanderlust Adventures',
      verified: true,
      rating: 4.9,
      tours: 45,
      badge: '5+ years'
    },
    {
      id: '2',
      name: 'Global Explorer Co',
      verified: true,
      rating: 4.8,
      tours: 32,
      badge: '3+ years'
    },
    {
      id: '3',
      name: 'Premium Experiences',
      verified: true,
      rating: 5.0,
      tours: 28,
      badge: 'Elite Partner'
    },
    {
      id: '4',
      name: 'Travel Masters',
      verified: true,
      rating: 4.7,
      tours: 51,
      badge: '6+ years'
    },
    {
      id: '5',
      name: 'Destination Dreams',
      verified: true,
      rating: 4.9,
      tours: 39,
      badge: '4+ years'
    },
    {
      id: '6',
      name: 'Journey Chronicles',
      verified: true,
      rating: 4.8,
      tours: 26,
      badge: '3+ years'
    },
  ]

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
    <section id="agencies" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
            <p className="text-sm font-semibold text-amber-900">Trusted Partners</p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
            Verified <span className="text-amber-600">Travel Agencies</span>
          </h2>
          <p className="text-lg text-slate-600">
            Trusted partners carefully selected for their expertise and customer satisfaction
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {agencies.map((agency) => (
            <motion.div
              key={agency.id}
              variants={itemVariants}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{agency.name}</h3>
                    {agency.verified && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        title="Verified Agency"
                      >
                        <CheckCircle2 className="text-amber-600 flex-shrink-0" size={20} />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{agency.badge}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(agency.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-slate-900">{agency.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Tours</span>
                  <span className="font-semibold text-amber-600">{agency.tours}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Money-back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Flexible Cancellation</span>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                className="w-full py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Tours
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
