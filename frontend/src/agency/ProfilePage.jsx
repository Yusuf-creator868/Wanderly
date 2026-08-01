import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, Camera, Phone, Mail, Send, Link2, MapPin, Globe2, BadgeCheck, Clock, ShieldAlert, CalendarDays, Layers, Eye, EyeOff, } from "lucide-react";
import api from "../api";
import { useParams } from "react-router-dom";



const PLAN_LABELS = { free: "Free", starter: "Starter", pro: "Pro", enterprise: "Enterprise" };

const STATUS_CONFIG = {
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    badgeClass: "bg-green-50 border-green-200 text-green-700",
    chipClass: "bg-green-50 text-green-600",
    valueClass: "text-green-700",
  },
  pending: {
    label: "Pending review",
    icon: Clock,
    badgeClass: "bg-amber-50 border-amber-200 text-amber-700",
    chipClass: "bg-amber-50 text-amber-600",
    valueClass: "text-amber-700",
  },
  rejected: {
    label: "Rejected",
    icon: ShieldAlert,
    badgeClass: "bg-red-50 border-red-200 text-red-700",
    chipClass: "bg-red-50 text-red-600",
    valueClass: "text-red-700",
  },
};

export default function AgencyProfile() {
  const [agency, setAgency] = useState(null);
  const [form, setForm] = useState({
    agency_name: "",
    logo: "",
    description: "",
    phone: "",
    email: "",
    city: "",
    country: "",
    plan: "free",
    verification_status: "pending",
    published: false,
    created_at: "",
  });

  const [editing, setEditing] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { slug } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleLogoPick = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
  };



  const startEditing = () => {
    setForm(agency);
    setEditing(true);
  };

  const cancelEditing = () => {
    setForm(agency);
    setEditing(false);
  };




  const saveChanges = () => {

    const formData = new FormData();

    formData.append("agency_name", form.agency_name);
    formData.append("description", form.description);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    // formData.append("address", form.address);
    formData.append("city", form.city);
    formData.append("country", form.country);

    if (logoFile) {
      formData.append('logo', logoFile)
    }



    api
      .patch(`agency/${slug}/`, formData)
      .then((res) => {
        setAgency(res.data);
        setForm(res.data);
        setEditing(false);
      })
      .catch((err) => {
        console.log(err.response?.data);
        console.log(err);
      });
  };


  useEffect(() => {
    setLoading(true);

    api
      .get(`agency/${slug}/`)
      .then((res) => {
        setAgency(res.data);
        setForm(res.data);
        setLogoFile(null);
        setLogoUrl("");
        setEditing(false);
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
        setError("Couldn't load agency.");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [slug]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading agency profile…</p>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-red-500">{error || "Agency not found."}</p>
      </div>
    );
  }

  const status = STATUS_CONFIG[agency.verification_status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-end gap-5">
            <div className="relative">
              {logoUrl || agency.logo ? (
                <img
                  src={logoUrl || `${agency.logo}`}
                  alt={agency.agency_name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white bg-white shadow-sm"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-4xl shadow-sm">
                  {agency.agency_name ? agency.agency_name[0].toUpperCase() : "A"}
                </div>
              )}
              {editing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change logo"
                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center text-white border-2 border-white"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoPick} className="hidden" />
                </>
              )}
            </div>

            <div className="pb-2">
              {editing ? (
                <input
                  name="agency_name"
                  value={form.agency_name}
                  onChange={handleChange}
                  className="text-2xl sm:text-3xl font-semibold text-gray-900 bg-transparent border-b border-orange-300 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {agency.agency_name || "Your agency"}
                </h1>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                  <Layers className="w-3.5 h-3.5" />
                  {PLAN_LABELS[agency.plan] || agency.plan} plan
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${status.badgeClass}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${agency.published
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-gray-100 border-gray-200 text-gray-500"
                    }`}
                >
                  {agency.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {agency.published ? "Published" : "Unpublished"}
                </span>
              </div>
            </div>
          </div>

          <div className="pb-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEditing}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Check className="w-4 h-4" />
                  Save changes
                </button>
              </div>
            ) : (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4" />
                Edit profile
              </button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: contact card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Contact</h2>
              <p className="text-xs text-gray-400 mb-2">How clients reach the agency</p>
              <div>
                <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.phone || "—"}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.email || "—"}</span>
                  )}
                </div>

                {/* <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-sky-600" />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="telegram"
                      value={form.telegram}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.telegram || "—"}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                    <Link2 className="w-4 h-4 text-pink-600" />
                  </div>
                  {editing ? (
                    <input
                      type="url"
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.instagram || "—"}</span>
                  )}
                </div> */}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Location</h2>
              {/* <p className="text-xs text-gray-400 mb-2">Registered business address</p> */}
              <div>
                {/* <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-violet-600" />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.address || "—"}</span>
                  )}
                </div> */}

                <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-violet-600" />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.city || "—"}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <Globe2 className="w-4 h-4 text-teal-600" />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="flex-1 min-w-0 bg-transparent border-b border-orange-300 pb-1 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{form.country || "—"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: about + stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">About</h2>
              <p className="text-xs text-gray-400 mb-3">Shown on the agency's public listing</p>
              {editing ? (
                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full text-sm text-gray-800 bg-orange-50/50 border border-orange-200 rounded-lg p-3 focus:outline-none focus:border-orange-400 leading-relaxed"
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{agency.description || "No description yet."}</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Account details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-orange-50/60 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-xs text-orange-600 mb-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Plan
                  </div>
                  <div className="text-sm font-semibold text-orange-700">{PLAN_LABELS[agency.plan]}</div>
                </div>

                <div className={`${status.chipClass} rounded-xl p-4`}>
                  <div className="flex items-center gap-1.5 text-xs mb-1.5">
                    <StatusIcon className="w-3.5 h-3.5" />
                    Verification
                  </div>
                  <div className={`text-sm font-semibold ${status.valueClass}`}>{status.label}</div>
                </div>

                <div
                  className={`rounded-xl p-4 ${agency.published ? "bg-emerald-50" : "bg-gray-100"
                    }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs mb-1.5 ${agency.published ? "text-emerald-600" : "text-gray-500"
                      }`}
                  >
                    {agency.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    Visibility
                  </div>
                  <div
                    className={`text-sm font-semibold ${agency.published ? "text-emerald-700" : "text-gray-600"
                      }`}
                  >
                    {agency.published ? "Published" : "Unpublished"}
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Member since
                  </div>
                  <div className="text-sm font-semibold text-indigo-700">  {new Date(agency.created_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}