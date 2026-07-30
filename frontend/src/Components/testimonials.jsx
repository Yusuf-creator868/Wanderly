import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      id: '1',
      name: 'Sarah Anderson',
      role: 'Luxury Traveler',
      content: 'Wanderly made booking our dream Maldives getaway incredibly easy. The verified agencies and transparent pricing gave us complete peace of mind.',
      rating: 5,
      location: 'New York, USA'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      role: 'Adventure Seeker',
      content: 'The quality of tours on Wanderly is exceptional. Every experience exceeded my expectations, and the customer support was outstanding.',
      rating: 5,
      location: 'Singapore'
    },
    {
      id: '3',
      name: 'Isabella Rodriguez',
      role: 'Group Organizer',
      content: 'We organized a group trip to Thailand through Wanderly. The seamless coordination and personalized service made it unforgettable.',
      rating: 5,
      location: 'Madrid, Spain'
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
            <p className="text-sm font-semibold text-amber-900">Testimonials</p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
            Loved by <span className="text-amber-600">Travelers</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Real stories from real travelers who&apos;ve experienced unforgettable journeys through Wanderly
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-base text-slate-700 mb-6 italic">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                <p className="text-sm text-slate-600">{testimonial.role}</p>
                <p className="text-xs text-slate-500 mt-1">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
