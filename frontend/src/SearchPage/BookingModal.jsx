import { useState, useEffect, useMemo } from "react";
import { X, Users, Calendar, Hotel as HotelIcon, ChevronRight, ChevronLeft, Check, ShieldCheck, BadgeCheck, Zap, Download, MessageCircle, Plane, MapPin, Star, ChevronDown, Clock, } from "lucide-react";
import { useTranslation } from "react-i18next";
import api, { MAIN_URL } from "../api";

/* ---------------------------------------------------------------------------
   DESIGN TOKENS
   Palette   — paper #FFFFFF, ink #1C1917 (stone-900), sand #FAF7F2 (surface),
               ember #EA580C (orange-600, primary accent), brass #B08D57
               (a muted gold used only for the ticket-stub signature + trust
               row — the one "luxury" flourish, kept out of everything else).
   Type      — Fraunces (display, step titles / price / headline moments),
               Inter (body / UI), IBM Plex Mono (booking codes, card digits —
               reads like a boarding pass / ticket number).
   Signature — the step rail is drawn as a flight path: a dashed route with a
               small plane marker that advances along it, and the divider
               between the form and the summary is perforated like a
               boarding-pass stub.
--------------------------------------------------------------------------- */

function useLuxuryFonts() {
  useEffect(() => {
    const id = "booking-modal-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap";
    document.head.appendChild(link);
  }, []);
}

const fontDisplay = { fontFamily: "'Fraunces', serif" };
const fontMono = { fontFamily: "'IBM Plex Mono', monospace" };

/* ---------------------------------------------------------------------------
   MOCK DATA — swap for real tour / hotel / departure props in production
--------------------------------------------------------------------------- */





const nationalities = [
  "Uzbekistan",
  "United States",
  "United Kingdom",
  "Italy",
  "Germany",
  "France",
  "Kazakhstan",
  "Turkey",
  "United Arab Emirates",
];

function VisaMark() {
  return <span className="text-base font-black italic tracking-tight text-[#1A1F71]">VISA</span>;
}
function MastercardMark() {
  return (
    <span className="flex items-center">
      <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
      <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B] opacity-90" />
    </span>
  );
}
function PayPalMark() {
  return (
    <span className="text-base font-black italic tracking-tight">
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009cde]">Pal</span>
    </span>
  );
}
function StripeMark() {
  return <span className="text-base font-bold italic text-[#635BFF]">stripe</span>;
}
function UzCardMark() {
  return (
    <span className="text-sm font-black tracking-tight">
      <span className="text-[#00A651]">Uz</span>
      <span className="text-[#0072BC]">Card</span>
    </span>
  );
}

const paymentMethods = [
  { id: "visa", label: "Visa", Mark: VisaMark },
  { id: "mastercard", label: "Mastercard", Mark: MastercardMark },
  { id: "paypal", label: "PayPal", Mark: PayPalMark },
  { id: "stripe", label: "Stripe", Mark: StripeMark },
  { id: "uzcard", label: "UzCard", Mark: UzCardMark },
];

// Identifiers only — actual display labels are looked up via t("booking.steps.<key>")
const STEP_KEYS = ["travelers", "travelerInformation", "confirmation"];

/* ---------------------------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------------------------- */

function FloatingInput({ label, value, onChange, type = "text", ...rest }) {
  return (
    <label className="group relative block">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full rounded-xl border border-stone-200 bg-white px-3.5 pb-2 pt-5 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        {...rest}
      />
      <span
        className="pointer-events-none absolute left-3.5 top-4 text-sm text-stone-400 transition-all
          peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-orange-600
          peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-stone-500"
      >
        {label}
      </span>
    </label>
  );
}

function FloatingSelect({ label, value, onChange, options }) {
  return (
    <label className="group relative block">
      <select
        value={value}
        onChange={onChange}
        className="peer w-full appearance-none rounded-xl border border-stone-200 bg-white px-3.5 pb-2 pt-5 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >
        <option value="" disabled hidden></option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span
        className={
          "pointer-events-none absolute left-3.5 text-stone-400 transition-all " +
          (value ? "top-2 text-[11px] text-stone-500" : "top-4 text-sm")
        }
      >
        {label}
      </span>
      <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-4 text-stone-400" />
    </label>
  );
}

// Signature progress rail — a dashed flight path with a plane marker
function FlightPathRail({ current }) {
  const { t } = useTranslation();
  const pct = (current / (STEP_KEYS.length - 1)) * 100;




  return (
    <div className="px-6 pb-5 pt-6 sm:px-8">
      <div className="relative">
        <div className="absolute left-0 right-0 top-[15px] h-px border-t-2 border-dashed border-stone-200" />
        <div
          className="absolute left-0 top-[15px] h-px border-t-2 border-solid border-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1.5 -translate-x-1/2 rotate-90 text-orange-600 transition-all duration-500 ease-out"
          style={{ left: `${pct}%` }}
        >
          <Plane size={16} className="fill-orange-500" />
        </div>
        <div className="relative flex justify-between">
          {STEP_KEYS.map((key, i) => {
            const label = t(`booking.steps.${key}`);
            const done = i < current;
            const active = i === current;
            return (
              <div key={key} className="flex flex-col items-center gap-2" style={{ width: 32 }}>
                <div
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition " +
                    (done
                      ? "border-orange-500 bg-orange-500 text-white"
                      : active
                        ? "border-orange-500 bg-white text-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]"
                        : "border-stone-200 bg-white text-stone-300")
                  }
                >
                  {done ? <Check size={14} /> : i + 1}
                </div>
                <span
                  className={
                    "hidden whitespace-nowrap text-[11px] font-medium sm:block " +
                    (active ? "text-stone-900" : "text-stone-400")
                  }
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



function TrustBadge({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
      <Icon size={13} className="text-[#B08D57]" />
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   STEP 1 — TRAVELERS
--------------------------------------------------------------------------- */

function StepTravelers({ guests, setGuests, departures, departureId, setDepartureId, hotels, hotelId, setHotelId }) {
  const { t } = useTranslation();
  const chosen = departures.find((d) => d.id === departureId);

  return (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-stone-900">{t("booking.howManyTravelers")}</h4>
        <div className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3.5">
          <div className="flex items-center gap-2.5 text-sm font-medium text-stone-700">
            <Users size={17} className="text-orange-600" />
            {t("booking.travelersLabel")}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-orange-400 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              −
            </button>
            <span className="w-5 text-center text-base font-semibold text-stone-900">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests(Math.min(chosen?.seats ?? 99, guests + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-orange-400 hover:text-orange-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-stone-900">{t("tourDetail.chooseADeparture")}</h4>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {departures.map((d) => {
            const date = new Date(d.departure_date);
            const time = new Date(`1970-01-01T${d.departure_time}`);
            const returning = new Date(d.return_date);
            const returnTime = new Date(`1970-01-01T${d.return_time}`);
            const active = departureId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDepartureId(d.id)}
                className={
                  "rounded-xl border p-3.5 text-left transition " +
                  (active
                    ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-500"
                    : "border-stone-200 hover:border-stone-300")
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Calendar size={12} />
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Clock size={12} />
                      {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div>
                    <ChevronRight size={15} className="text-stone-400" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Calendar size={12} />
                      {returning.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Clock size={12} />
                      {returnTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 text-[11px] text-stone-400">{t("card.seatsLeft", { count: d.available_seats })}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-stone-900">{t("booking.chooseYourHotel")}</h4>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {hotels.map((h) => {
            const active = hotelId === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setHotelId(h.id)}
                className={
                  "flex items-center gap-3 rounded-xl border p-2.5 text-left transition " +
                  (active
                    ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-500"
                    : "border-stone-200 hover:border-stone-300")
                }
              >
                <img src={`${h.images[0].image}`} alt={h.name} className="h-12 w-14 flex-none rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-stone-900">{h.name}</div>
                  <div className="text-[14px]">{h.price} {t("card.perPerson")}</div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: h.stars }).map((_, s) => (
                      <Star key={s} size={9} className="fill-orange-500 text-orange-500" />
                    ))}
                    <span className="ml-1 truncate text-[11px] text-stone-400">{h.room_type}</span>
                  </div>
                </div>
                <div
                  className={
                    "flex h-4 w-4 flex-none items-center justify-center rounded-full border " +
                    (active ? "border-orange-500 bg-orange-500" : "border-stone-300")
                  }
                >
                  {active && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   STEP 2 — TRAVELER INFORMATION
--------------------------------------------------------------------------- */

function StepTravelerInfo({ travelers, updateTraveler }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      {travelers.map((tr, i) => (
        <div key={i} className="rounded-2xl border border-stone-200 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-[11px] font-bold text-orange-600"
              style={fontMono}
            >
              {i + 1}
            </span>
            <h4 className="text-sm font-semibold text-stone-900">
              {t("booking.travelerNumber", { number: i + 1 })}
              {i === 0 && <span className="ml-1.5 font-normal text-stone-400">({t("booking.lead")})</span>}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FloatingInput
              label={t("booking.fullName")}
              value={tr.full_name}
              onChange={(e) => updateTraveler(i, "full_name", e.target.value)}
            />
            <FloatingInput
              label={t("booking.passportNumber")}
              value={tr.passport_number}
              onChange={(e) => updateTraveler(i, "passport_number", e.target.value)}
            />
            <FloatingSelect
              label={t("booking.nationality")}
              value={tr.nationality}
              onChange={(e) => updateTraveler(i, "nationality", e.target.value)}
              options={nationalities}
            />
            <FloatingInput
              label={t("booking.dateOfBirth")}
              type="date"
              value={tr.birth_date}
              onChange={(e) => updateTraveler(i, "birth_date", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   STEP 3 — PAYMENT
--------------------------------------------------------------------------- */

function StepPayment({ method, setMethod, card, setCard }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-stone-900">{t("booking.paymentMethod")}</h4>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {paymentMethods.map(({ id, Mark }) => {
            const active = method === id;
            return (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={
                  "flex h-14 items-center justify-center rounded-xl border-2 bg-white px-3 transition " +
                  (active
                    ? "border-orange-500 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]"
                    : "border-stone-200 hover:border-stone-300")
                }
              >
                <Mark />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <FloatingInput
          label={t("booking.cardNumber")}
          value={card.number}
          onChange={(e) => setCard({ ...card, number: e.target.value })}
          inputMode="numeric"
        />
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label={t("booking.expiry")}
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
          />
          <FloatingInput
            label={t("booking.cvv")}
            value={card.cvv}
            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   STEP 4 — CONFIRMATION
--------------------------------------------------------------------------- */

function StepConfirmation({ bookingId, onDownload, onContact }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_8px_30px_-6px_rgba(234,88,12,0.55)]">
        <Check size={34} className="text-white" strokeWidth={3} />
      </div>
      <h3 className="mt-6 text-2xl font-medium text-stone-900" style={fontDisplay}>
        {t("booking.tripReserved")}
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-stone-500">
        {t("booking.agencyWillFollowUp")}
      </p>
      

    </div>
  );
}

/* ---------------------------------------------------------------------------
   SUMMARY SIDEBAR
--------------------------------------------------------------------------- */

function SummarySidebar({ tour, hotel, departure, guests, pricing }) {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col bg-stone-50 p-6 sm:p-7">
      <img src={`${tour.cover_image}`} alt={tour.title} className="h-32 w-full rounded-xl object-cover" />
      <h3 className="mt-4 text-lg font-medium leading-snug text-stone-900" style={fontDisplay}>
        {tour.title}
      </h3>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
        <MapPin size={12} />
        {tour.description.length > 120
          ? tour.description.slice(0, 120) + "..."
          : tour.description}
      </div>

      {/* perforated ticket-stub divider */}
      <div className="relative my-5">
        <div className="absolute -left-7 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white sm:-left-7" />
        <div className="absolute -right-7 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white sm:-right-7" />
        <div className="border-t-2 border-dashed border-stone-200" />
      </div>

      <div className="space-y-2.5 text-sm">

        <div className="flex items-center justify-between text-stone-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {t("booking.departure")}
          </span>
          <span className="font-medium text-stone-800">
            {departure
              ? new Date(departure.departure_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between text-stone-500">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {t("booking.time")}
          </span>
          {
            departure
              ? new Date(`1970-01-01T${departure.departure_time}`).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "—"
          }
        </div>

        <div className="flex items-center justify-between text-stone-500">
          <span className="flex items-center gap-1.5">
            <HotelIcon size={13} /> {t("booking.hotel")}
          </span>
          <span className="max-w-[55%] truncate text-right font-medium text-stone-800">
            {hotel?.name ?? "—"}
          </span>
        </div>
        <div className="flex items-center justify-between text-stone-500">
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {t("booking.travelersLabel")}
          </span>
          <span className="font-medium text-stone-800">{guests}</span>
        </div>
      </div>

      <div className="my-5 border-t border-stone-200" />

      <div className="space-y-2 text-sm text-stone-500">
        <div className="flex justify-between">
          <span>{t("booking.basePrice")}</span>
          <span className="text-stone-800">${pricing.subtotal.toLocaleString()}</span>
        </div>
        {/* <div className="flex justify-between">
          <span>Taxes</span>
          <span className="text-stone-800">${pricing.taxes.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <span className="text-stone-800">${pricing.serviceFee.toLocaleString()}</span>
        </div> */}
        <div
          className="flex justify-between border-t border-stone-200 pt-2.5 text-lg font-semibold text-stone-900"
          style={fontDisplay}
        >
          <span>{t("booking.total")}</span>
          <span>${pricing.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-[11px] font-medium text-orange-700">
        <ShieldCheck size={13} />
        {t("booking.freeCancellation")}
      </div>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-6">
        <TrustBadge icon={ShieldCheck}>{t("booking.securePayment")}</TrustBadge>
        <TrustBadge icon={BadgeCheck}>{t("booking.verifiedAgency")}</TrustBadge>
        <TrustBadge icon={Zap}>{t("booking.instantConfirmation")}</TrustBadge>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MAIN MODAL
--------------------------------------------------------------------------- */

function makeTraveler() {
  return { full_name: "", passport_number: "", nationality: "", birth_date: "" };
}





export default function BookingModalInner({ onClose, tour, departures, hotels }) {
  const { t } = useTranslation();
  useLuxuryFonts();

  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState(2);
  const [departureId, setDepartureId] = useState(departures[0].id);
  const [hotelId, setHotelId] = useState(hotels[0].id);
  const [travelers_info, setTravelers] = useState([makeTraveler(), makeTraveler()]);
  const [method, setMethod] = useState("visa");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [bookingId] = useState(
    "SRT-" + Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  const departure = departures.find((d) => d.id === departureId);
  const hotel = hotels.find((h) => h.id === hotelId);

  // keep the traveler-info forms in sync with the guest count
  useEffect(() => {
    setTravelers((prev) => {
      const next = [...prev];
      while (next.length < guests) next.push(makeTraveler());
      while (next.length > guests) next.pop();
      return next;
    });
  }, [guests]);

  const pricing = useMemo(() => {
    const subtotal = (hotel?.price ?? 0) * guests;
    // const taxes = Math.round(subtotal * 0.08);
    // const serviceFee = Math.round(subtotal * 0.03);
    return { subtotal, total: subtotal };
  }, [hotel, guests]);

  const updateTraveler = (i, field, value) =>
    setTravelers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  const canContinue = () => {
    if (step === 1) return travelers_info.every((t) => t.full_name && t.passport_number && t.nationality && t.birth_date);
    // if (step === 2) return method && card.number && card.expiry && card.cvv;
    return true;
  };

  const goNext = async () => {
    if (step === 1) {
      setProcessing(true);
      const payload = {
        tour: tour.id,
        departure: departureId,
        hotel: hotelId,
        travelers: guests,
        total_price: pricing.total,
        travelers_info,
      }
      try {
        const res = await api.post("/bookings/", payload);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        console.log(err.response?.data);
      }
      console.log(payload)
      setTimeout(() => {
        setProcessing(false);
        setStep(2);
      }, 1300);

      return;
    }
    setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1));
  };





  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-[1.55fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT — booking flow */}
        <div className="flex max-h-[92vh] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 pt-5 sm:px-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
              {tour.agency.agency_name}
            </span>
            <button
              onClick={onClose}
              aria-label={t("tourDetail.close")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <X size={18} />
            </button>
          </div>

          <FlightPathRail current={step} />

          <div className="flex-1 overflow-y-auto px-6 pb-4 sm:px-8">
            <h2 className="mb-5 text-xl font-medium text-stone-900" style={fontDisplay}>
              {t(`booking.steps.${STEP_KEYS[step]}`)}
            </h2>

            {step === 0 && (
              <StepTravelers
                guests={guests}
                setGuests={setGuests}
                departures={departures}
                departureId={departureId}
                setDepartureId={setDepartureId}
                hotels={hotels}
                hotelId={hotelId}
                setHotelId={setHotelId}
              />
            )}
            {step === 1 && <StepTravelerInfo travelers={travelers_info} updateTraveler={updateTraveler} />}
            {/* {step === 2 && <StepPayment method={method} setMethod={setMethod} card={card} setCard={setCard} />} */}
            {step === 2 && (
              <StepConfirmation
                bookingId={bookingId}
                onDownload={() => { }}
                onContact={() => { }}
              />
            )}
          </div>

          {step < 2 && (
            <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-6 py-4 sm:px-8">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-1 text-sm font-medium text-stone-500 transition hover:text-stone-800 disabled:cursor-not-allowed disabled:opacity-0"
              >
                <ChevronLeft size={15} />
                {t("booking.back")}
              </button>
              <button
                onClick={goNext}
                disabled={!canContinue() || processing}
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing ? (
                  t("booking.processing")
                ) : step === 1 ? (
                  // `Pay $${pricing.total.toLocaleString()}`
                  t("booking.confirmBooking")

                ) : (
                  <>
                    {t("booking.continueButton")}
                    <ChevronRight size={15} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — sticky summary */}
        <div className="hidden max-h-[92vh] overflow-y-auto border-l border-stone-100 lg:block">
          <SummarySidebar tour={tour} hotel={hotel} departure={departure} guests={guests} pricing={pricing} />
        </div>
      </div>
    </div>
  );
}