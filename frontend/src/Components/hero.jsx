import { motion } from 'framer-motion'
import { Search, MapPin, Calendar } from 'lucide-react'
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import main from '../assets/main.jpg'
import { useAuth } from "../useAuth";

export function HeroSection() {
  const { t } = useTranslation()
  const destinations = ['Maldives', 'Turkey', 'Dubai', 'Bali', 'Thailand']
  const { Auth } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">

      {/* Background Image */}
      <img
        src={main}
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-8">

          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-full">
            <p className="text-sm font-semibold text-white">
              {t("landingHero.badge")}
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
            {t("landingHero.headingPart1")} <span className="text-amber-400">{t("landingHero.headingHighlight")}</span> {t("landingHero.headingPart2")}
          </h1>

          {/* Description */}
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            {t("landingHero.description")}
          </p>





          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">

            <Link
              to="search"
              className="px-8 py-4 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition shadow-lg text-center"
            >
              {t("landingHero.exploreTours")}
            </Link>

            {Auth ? 
            null
            :
            <Link
              to="/register?role=agency"
              className="px-8 py-4 border border-white/30 bg-white/10 backdrop-blur text-white rounded-lg font-semibold hover:bg-white/20 transition text-center"
            >
              {t("landingHero.partnerWithUs")}
            </Link>
            }

          </div>

 
        </motion.div>
      </motion.div>
    </div>
  )
}