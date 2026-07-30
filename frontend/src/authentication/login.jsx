import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from "../useAuth";
import { GoogleLogin } from "@react-oauth/google";
import api from '../api';

export default function LoginPage() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { login_auth, loadUser, loadUserInfo } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [error, setError] = useState("")   // add this
  const from = loc.state?.from || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")   // clear old error
    const result = await login_auth(formData.email, formData.password, formData.remember)
    if (result.success) {
      nav(from, { replace: true });
    } else {
      setError(result.message)
    }
  };

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
      {/* Background decorative elements */}
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

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className=" rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >


          {/* Right side - Login form */}
          <motion.div
            className="p-8 sm:p-12 flex flex-col justify-between min-h-full md:min-h-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div>
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="font-bold text-lg text-black">W</span>
                  </div>
                  <span className="font-bold text-lg text-black">Wanderly</span>
                </div>
                <h1 className="text-3xl font-bold mt-6 mb-2">{t("login.title")}</h1>
                <p className="text-muted-foreground text-sm">{t("login.subtitle")}</p>
              </motion.div>

              <form onSubmit={handleSubmit}>
                {/* -----> */}
                {/* Email field */}
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-black">{t("login.emailLabel")}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                    <input
                      type="email"
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("login.emailPlaceholder")}
                      className="w-full pl-12 pr-4 py-3 bg-secondary text-black border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition"
                    />
                  </div>
                </motion.div>

                {/* Password field */}
                <motion.div variants={itemVariants} className="mb-2">
                  <label className="block text-sm font-medium mb-2 text-black">{t("login.passwordLabel")}</label>
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
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Forgot password */}
                <motion.div variants={itemVariants} className="mb-6 text-right">
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-600"
                      />

                      <span className="text-gray-600">{t("login.rememberMe")}</span>
                    </label>

                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t("login.forgotPassword")}
                    </button>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Sign in button */}
                <motion.button
                  type='submit'
                  variants={itemVariants}
                  className="w-full py-3 bg-accent text-black rounded-lg font-semibold hover:bg-accent/90 transition mb-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("login.signIn")}
                </motion.button>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">{t("login.orContinueWith")}</span>
                  </div>
                </motion.div>

                {/* Social buttons */}
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                  <GoogleLogin
                    locale={i18n.language}
                    onSuccess={async (credentialResponse) => {
                      try {
                        await api.post("google-login/",
                          { token: credentialResponse.credential },
                          { withCredentials: true });
                        await loadUser();
                        await loadUserInfo();
                        nav(from, { replace: true })

                        // Since your backend sets JWT cookies,
                        // the user is now logged in.
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    onError={() => {
                      console.log("Google Login Failed");
                    }}
                  />
                </motion.div>

              </form>
            </div>


            {/* Sign up link */}
            <motion.div variants={itemVariants} className="text-center text-sm">
              <span className="text-muted-foreground">{t("login.noAccount")} </span>
              <Link to="/register" className="text-accent hover:text-accent/80 font-semibold transition">
                {t("login.signUp")}
              </Link>
            </motion.div>


          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}