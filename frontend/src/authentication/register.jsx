import { motion } from 'framer-motion'
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../useAuth'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const initialRole = params.get('role') || 'traveler'
  const { register_auth, setAuth } = useAuth()
  const [role, setRole] = useState(initialRole)
  const nav = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    agency_name: "",
    username: "",
    email: "",
    password: "",
    Cpassword: "",
  });
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => {
    const { name, value, } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register_auth(formData.agency_name, formData.username, formData.email, formData.password, formData.Cpassword, role)
      alert("Registration successful! Please check your email to verify your account before logging in.")
      nav("/login")
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert(t("register.failureAlert"))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >

          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="font-bold text-lg text-black">W</span>
                </div>
                <span className="font-bold text-lg text-black">Wanderly</span>
              </div>

              <h1 className="text-3xl font-bold mt-6 mb-2 text-black">{t("register.title")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("register.subtitle")}
              </p>
            </motion.div>

            {/* Role selector */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block text-sm font-medium mb-3 text-black">{t("register.iAmA")}</label>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setRole('traveler')}
                  className={`p-4 rounded-lg border-2 transition text-center font-semibold ${role === 'traveler'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-accent/50 text-black'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🧳 {t("register.traveler")}
                </motion.button>

                <motion.button
                  onClick={() => setRole('agency')}
                  className={`p-4 rounded-lg border-2 transition text-center font-semibold ${role === 'agency'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-accent/50 text-black'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🏢 {t("register.agency")}
                </motion.button>
              </div>
            </motion.div>

            {/* Name */}
            <form onSubmit={handleSubmit}>

              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  {role === 'agency' ? t("register.agencyNameLabel") : t("register.fullNameLabel")}
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input
                    name={role === 'agency' ? 'agency_name' : 'username'}
                    value={role === 'agency' ? formData.agency_name : formData.username}
                    onChange={handleChange}
                    placeholder={role === 'agency' ? t("register.agencyNamePlaceholder") : t("register.fullNamePlaceholder")}
                    className="w-full text-black pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">{t("register.emailLabel")}</label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input
                    type="email"
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 text-black bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition"
                  />
                </div>
              </motion.div>



              {/* Password */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">{t("register.passwordLabel")}</label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-secondary text-black border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>




              {/* Password Confrim */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">{t("register.confirmPasswordLabel")}</label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='Cpassword'
                    value={formData.Cpassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-secondary text-black border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>






              {/* Terms */}
              <motion.div variants={itemVariants} className="mb-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 accent-accent"
                />

                <label className="text-sm text-muted-foreground">
                  {t("register.agreeToThe")}{' '}
                  <Link to="#" className="text-accent hover:text-accent/80 transition">
                    {t("register.termsOfService")}
                  </Link>{' '}
                  {t("register.and")}{' '}
                  <Link to="#" className="text-accent hover:text-accent/80 transition">
                    {t("register.privacyPolicy")}
                  </Link>
                </label>
              </motion.div>

              {/* Button */}
              <motion.button
                disabled={!agreed}
                type='submit'
                className="w-full py-3 bg-accent text-black rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                whileHover={{ scale: agreed ? 1.02 : 1 }}
                whileTap={{ scale: agreed ? 0.98 : 1 }}
              >
                {t("register.createAccount")}
              </motion.button>
            </form>

            {/* Sign in */}
            <motion.div variants={itemVariants} className="text-center text-sm">
              <span className="text-muted-foreground">{t("register.alreadyHaveAccount")} </span>
              <Link to="/login" className="text-accent hover:text-accent/80 font-semibold transition">
                {t("register.signIn")}
              </Link>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}