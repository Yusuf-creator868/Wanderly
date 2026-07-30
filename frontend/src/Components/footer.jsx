import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Heart, Share2, MessageCircle, Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: t("footer.sections.product.title"),
      links: [
        t("footer.sections.product.links.browseTours"),
        t("footer.sections.product.links.agencies"),
        t("footer.sections.product.links.reviews"),
        t("footer.sections.product.links.pricing"),
      ]
    },
    {
      title: t("footer.sections.agency.title"),
      links: [
        t("footer.sections.agency.links.becomePartner"),
        t("footer.sections.agency.links.dashboard"),
        t("footer.sections.agency.links.resources"),
        t("footer.sections.agency.links.verification"),
      ]
    },
    {
      title: t("footer.sections.support.title"),
      links: [
        t("footer.sections.support.links.helpCenter"),
        t("footer.sections.support.links.contactUs"),
        t("footer.sections.support.links.faq"),
        t("footer.sections.support.links.blog"),
      ]
    },
    {
      title: t("footer.sections.legal.title"),
      links: [
        t("footer.sections.legal.links.privacyPolicy"),
        t("footer.sections.legal.links.termsOfService"),
        t("footer.sections.legal.links.cookiePolicy"),
        t("footer.sections.legal.links.security"),
      ]
    },
  ]

  const socialLinks = [
    { icon: Code2, href: '#', label: 'GitHub' },
    { icon: Heart, href: '#', label: 'Instagram' },
    { icon: Share2, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'Contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-white">Wanderly</span>
            </div>
            <p className="text-sm text-slate-400">
              {t("footer.brand.tagline")}
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="p-2 hover:bg-slate-800 rounded-lg transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} className="text-slate-400 hover:text-amber-500 transition" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Links */}
          {footerSections.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-semibold text-sm mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-slate-400 hover:text-amber-500 transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="border-t border-slate-800 py-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-slate-500 text-center sm:text-left">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-slate-400 hover:text-amber-500 transition">
              {t("footer.bottomLinks.privacy")}
            </Link>
            <Link to="#" className="text-sm text-slate-400 hover:text-amber-500 transition">
              {t("footer.bottomLinks.terms")}
            </Link>
            <Link to="#" className="text-sm text-slate-400 hover:text-amber-500 transition">
              {t("footer.bottomLinks.cookies")}
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}