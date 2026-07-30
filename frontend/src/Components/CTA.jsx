import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)' }}
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)' }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-balance leading-tight text-white">
          {t("cta.headingPart1")} <span className="text-amber-400">{t("cta.headingHighlight")}</span>
        </h2>

        <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          {t("cta.subtitle")}
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="search"
              className="px-10 py-4 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition block shadow-lg hover:shadow-xl"
            >
              {t("cta.exploreToursNow")}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register?role=agency"
              className="px-10 py-4 border border-amber-500 text-amber-400 rounded-lg font-semibold hover:bg-amber-500/10 transition block"
            >
              {t("cta.partnerWithUs")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}