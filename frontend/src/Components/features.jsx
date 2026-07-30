import { motion } from 'framer-motion'
import { Shield, Zap, Users, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Shield,
      title: t("features.verifiedAgencies.title"),
      description: t("features.verifiedAgencies.description")
    },
    {
      icon: Zap,
      title: t("features.secureBooking.title"),
      description: t("features.secureBooking.description")
    },
    {
      icon: Users,
      title: t("features.expertSupport.title"),
      description: t("features.expertSupport.description")
    },
    {
      icon: Trophy,
      title: t("features.bestExperiences.title"),
      description: t("features.bestExperiences.description")
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
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
            <p className="text-sm font-semibold text-amber-900">{t("features.badge")}</p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
            {t("features.headingPart1")} <span className="text-amber-600">Wanderly</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="text-amber-600" size={24} />
                </motion.div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}