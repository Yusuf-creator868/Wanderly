import { useState, useEffect, useCallback } from "react";
import { MapPin, Star, Clock, Moon, Users, Plane, Utensils, ArrowRight,  PlaneTakeoff, PlaneLanding, Hotel as HotelIcon, Car, UserCheck, CheckCircle2, XCircle, Calendar, Phone, Mail, ShieldCheck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BedDouble, Grid2x2, BadgeCheck, X, Heart, Share2, Locate, LocateFixedIcon,} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";
import BookingModalInner from "./BookingModal";
import { useAuth } from "../useAuth"

// ---------------------------------------------------------------------------
// Static presentation helpers only — all tour/hotel/agency/itinerary/
// departure data now comes from the `tour` state (fetched from the API).
// ---------------------------------------------------------------------------

// The API returns media paths like "/media/gallery/xyz.jpg" — relative to
// the Django backend, not the frontend. Prefix them with the backend host.
// TODO: point this at your actual backend origin (or read it from `api`'s
// baseURL / an env var) instead of hardcoding it.
const MEDIA_BASE_URL = "http://localhost:8000";

function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${MEDIA_BASE_URL}${path}`;
}

// Maps a meal_plan value to its i18next key (reuses the shared "mealPlans"
// namespace so labels stay consistent with the tour search/filter UI).
const mealPlanKeys = {
  breakfast: "mealPlans.breakfast",
  half_board: "mealPlans.halfBoard",
  full_board: "mealPlans.fullBoard",
  all_inclusive: "mealPlans.allInclusive",
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function StarRow({ rating, size = 16 }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < full ? "fill-orange-500 text-orange-500" : "text-stone-200"}
        />
      ))}
    </div>
  );
}



function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-5 border-b border-stone-100 pb-4">
      <h2 className="text-xl font-semibold tracking-tight text-stone-900">{children}</h2>
      {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
    </div>
  );
}



function FactPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3">
      <Icon size={18} className="flex-none text-orange-600" strokeWidth={1.75} />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-stone-400">{label}</div>
        <div className="truncate text-sm font-medium text-stone-900">{value}</div>
      </div>
    </div>
  );
}



function InclusionChip({ active, icon: Icon, label }) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium " +
        (active
          ? "border-stone-200 text-stone-700"
          : "border-stone-100 text-stone-300 line-through")
      }
    >
      <Icon size={14} className={active ? "text-orange-600" : "text-stone-300"} />
      {label}
    </div>
  );
}





// Clickable image tile with a soft, elegant zoom on hover
function ZoomableImage({ src, alt, className, onOpen, rounded = "rounded-2xl" }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={
        "group relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 " +
        rounded +
        " " +
        (className || "")
      }
    >
      <img
        src={src}
        alt={alt || ""}
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-stone-900/0 transition duration-300 group-hover:bg-stone-900/10" />
    </button>
  );
}







// Airbnb-style hero gallery: large image left (2 rows), 2x2 grid right
function GalleryGrid({ images, title, onOpen }) {
  const { t } = useTranslation();
  const [hero, ...rest] = images;
  const smalls = rest.slice(0, 4);

  return (
    <div className="relative">
      {/* Desktop / tablet grid */}
      <div className="hidden gap-3 sm:grid sm:h-[440px] sm:grid-cols-4 sm:grid-rows-2">
        <ZoomableImage
          src={hero}
          alt={title}
          className="col-span-2 row-span-2 h-full"
          onOpen={() => onOpen(0)}
        />
        {smalls.map((src, i) => (
          <ZoomableImage
            key={i}
            src={src}
            className="col-span-1 row-span-1 h-full"
            onOpen={() => onOpen(i + 1)}
          />
        ))}
      </div>

      {/* Mobile: single hero image */}
      <ZoomableImage
        src={hero}
        alt={title}
        className="h-72 w-full sm:hidden"
        rounded="rounded-2xl"
        onOpen={() => onOpen(0)}
      />

      <button
        onClick={() => onOpen(0)}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-sm transition hover:shadow-md"
      >
        <Grid2x2 size={14} />
        {t("tourDetail.showAllPhotos")}
      </button>
    </div>
  );
}








function HotelCard({ hotel, onOpenImage }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const allImages = [hotel.cover_image, ...(hotel.images || [])];

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-60 w-full flex-none sm:h-auto sm:w-64">
          <ZoomableImage
            src={hotel.cover_image}
            alt={hotel.name}
            className="h-full w-full"
            rounded="rounded-none"
            onOpen={() => onOpenImage(allImages, 0)}
          />
          {hotel.nights != null && (
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-800 shadow-sm">
              <BedDouble size={13} className="text-orange-600" />
              {t("card.nights", { count: hotel.nights })}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-base font-semibold text-stone-900">{hotel.name}</h4>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} size={13} className="fill-orange-500 text-orange-500" />
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <HotelIcon size={14} className="text-stone-400" />
                {hotel.room_type}
              </span>
              <span className="flex items-center gap-1.5">
                <Utensils size={14} className="text-stone-400" />
                {t(mealPlanKeys[hotel.meal_plan])}
              </span>
            </div>
          </div>

          <div>
            <h2>${hotel.price} <span className="text-[15px] text-gray-500">{t("card.perPerson")}</span></h2>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-stone-900 underline-offset-4 hover:underline"
          >
            {open ? t("tourDetail.hidePhotos") : t("tourDetail.viewPhotos")}
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-2 gap-3 border-t border-stone-100 p-4 sm:grid-cols-3">
          {(hotel.images || []).map((src, i) => (
            <ZoomableImage
              key={i}
              src={src}
              className="h-36"
              onOpen={() => onOpenImage(allImages, i + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}





function formatShort(dateStr) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

function TicketCard({ departure }) {
  const { t } = useTranslation();
  const start = formatShort(departure.departure_date);
  const end = formatShort(departure.return_date);

  const nights = Math.round(
    (new Date(departure.return_date) - new Date(departure.departure_date)) /
    (1000 * 60 * 60 * 24)
  );

  const low = departure.available_seats <= 3;

  return (
    <button
      className="group flex w-full flex-col items-stretch overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md sm:flex-row"
    >
      {/* Date block */}
      <div className="flex w-full flex-none flex-col justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-3 text-white sm:w-40 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-orange-100">
              {start.weekday}
            </div>
            <div className="text-lg font-bold leading-none">{start.day}</div>
            <div className="text-[10px] font-semibold tracking-wide text-orange-100">
              {start.month}
            </div>
          </div>
          <ArrowRight size={14} className="mx-1 flex-none text-orange-200" />
          <div className="text-right">
            <div className="text-[10px] font-semibold tracking-wide text-orange-100">
              {end.weekday}
            </div>
            <div className="text-lg font-bold leading-none">{end.day}</div>
            <div className="text-[10px] font-semibold tracking-wide text-orange-100">
              {end.month}
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] font-medium uppercase tracking-wider text-orange-100">
          {t("cards.nights", { count: nights })}
        </div>
      </div>

      {/* Flight info */}
      <div className="flex flex-1 items-center gap-4 px-4 py-3">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10">

            <div className="flex flex-row flex-wrap items-center gap-2 text-xs text-stone-700">
              <PlaneTakeoff size={13} className="flex-none text-orange-500" />
              <span className="font-semibold text-stone-900">{departure.departure_time}</span>
              <span className="text-stone-400">
                · {start.weekday} {start.day} {start.month}
              </span>
            </div>

            <div className="flex flex-row flex-wrap items-center gap-2 text-xs text-stone-700">
              <PlaneTakeoff size={13} className="flex-none text-orange-500" />
              <span className="font-semibold text-stone-900">{departure.return_time}</span>
              <span className="text-stone-400">
                · {end.weekday} {end.day} {end.month}
              </span>

            </div>


          </div>

          <div
            className={
              "flex items-center gap-1 text-xs " +
              (low ? "font-medium text-orange-600" : "text-stone-400")
            }
          >
            <Users size={12} />
            {t("card.seatsLeft", { count: departure.available_seats })}
            {low && ` · ${t("tourDetail.almostFull")}`}
          </div>
        </div>


      </div>
    </button>
  );
}












// Simple, stylized payment-method marks (not brand logo assets — just recognizable, brand-toned representations)
function VisaMark() {
  return <span className="text-lg font-black italic tracking-tight text-[#1A1F71]">VISA</span>;
}

function MastercardMark() {
  return (
    <span className="flex items-center">
      <span className="h-5 w-5 rounded-full bg-[#EB001B]" />
      <span className="-ml-2 h-5 w-5 rounded-full bg-[#F79E1B] opacity-90" />
    </span>
  );
}

function PayPalMark() {
  return (
    <span className="text-lg font-black italic tracking-tight">
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009cde]">Pal</span>
    </span>
  );
}

function StripeMark() {
  return <span className="text-lg font-bold italic text-[#635BFF]">stripe</span>;
}

function UzCardMark() {
  return (
    <span className="text-base font-black tracking-tight">
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























// Fullscreen lightbox with prev/next + keyboard support
function Lightbox({ images, index, onClose, onNavigate }) {
  const { t } = useTranslation();
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    },
    [onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/92 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label={t("tourDetail.close")}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            aria-label={t("tourDetail.previousImage")}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            aria-label={t("tourDetail.nextImage")}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl sm:max-w-[80vw]"
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

































export default function TourDetailPage() {

  const { t } = useTranslation();
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const { Auth, setAuth, userinfo } = useAuth()
  const [saved, setSaved] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const nav = useNavigate()
  const loc = useLocation()
  const [reserveOpen, setReserveOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { images: [], index: 0 }
  const openLightbox = (images, index = 0) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const navigateLightbox = (delta) =>
    setLightbox((lb) =>
      lb
        ? { ...lb, index: (lb.index + delta + lb.images.length) % lb.images.length }
        : lb
    );


  useEffect(() => {
    api
      .get(`get_tour_details_users/${id}/`)
      .then((res) => {
        console.log(res.data);
        setTour(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  if (!tour) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-stone-400">{t("tourDetail.loadingTour")}</p>
      </div>
    );
  }



  // The API's tour object isn't shaped exactly like the UI wants it, so
  // derive the display-ready values here rather than sprinkling fallbacks
  // throughout the JSX below.
  const galleryImages = [
    ...(tour.cover_image ? [mediaUrl(tour.cover_image)] : []),
    ...tour.images.map((img) => mediaUrl(img.image)),
  ];

  // The API doesn't return a "nights" field on the tour itself — it's
  // conventionally one less than the day count.
  const nights = tour.duration ? tour.duration - 1 : null;

  const includedLabels = tour.included_items.map((item) => item.title);
  const excludedLabels = tour.excluded_items.map((item) => item.title);

  const normalizedHotels = tour.hotels.map((hotel) => {
    const imageUrls = (hotel.images || []).map((img) => mediaUrl(img.image));
    return {
      ...hotel,
      cover_image: imageUrls[0] || "",
      images: imageUrls.slice(1),
    };
  });


  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: tour?.title,
          text: t("tourDetail.shareText"),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t("tourDetail.linkCopied"));
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        {/* Title block */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
              {tour.category}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              {tour.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-stone-400" />
                {tour.city}, {tour.country}
              </span>

            </div>
          </div>

          <div className="flex flex-none items-center gap-2">
            <button onClick={handleShare} className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3.5 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
              <Share2 size={15} />
              {t("tourDetail.share")}
            </button>

          </div>
        </div>





        {/* Gallery */}
        <div className="mt-6">
          <GalleryGrid
            images={galleryImages}
            title={tour.title}
            onOpen={(i) => openLightbox(galleryImages, i)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-10 sm:px-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-10 lg:col-span-2">



          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <FactPill icon={Clock} label={t("tourDetail.durationLabel")} value={t("tourDetail.daysCount", { count: tour.duration })} />
            <FactPill icon={Moon} label={t("tourDetail.nightsLabel")} value={t("cards.nights", { count: tour.nights })} />
            <FactPill icon={Users} label={t("tourDetail.totalSeatsLabel")} value={`${tour.total_seats} `} />

          </div>





          {/* Departures */}
          <section>
            <SectionTitle>{t("tourDetail.chooseADeparture")}</SectionTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
              {tour.departures.map((d, i) => (
                <TicketCard
                  key={i}
                  departure={d}
                />
              ))}
            </div>
          </section>





          {/* Overview */}
          <section>
            <SectionTitle>{t("tourDetail.overview")}</SectionTitle>
            <p className="leading-relaxed text-stone-600">{tour.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <InclusionChip active={tour.flight_included} icon={Plane} label={t("tourDetail.flights")} />
              <InclusionChip active={tour.hotel_included} icon={HotelIcon} label={t("tourDetail.hotels")} />
              <InclusionChip active={tour.meals_included} icon={Utensils} label={t("tourDetail.meals")} />
              <InclusionChip active={tour.car} icon={Car} label={t("tourDetail.privateCar")} />
              <InclusionChip active={tour.guide_included} icon={UserCheck} label={t("tourDetail.localGuide")} />
            </div>
          </section>




          {/* Where you'll stay */}
          <section>
            <SectionTitle subtitle={t("tourDetail.whereYoullStaySubtitle")}>
              {t("tourDetail.whereYoullStay")}
            </SectionTitle>
            <div className="space-y-5">
              {normalizedHotels.map((h, i) => (
                <HotelCard key={h.id ?? i} hotel={h} onOpenImage={openLightbox} />
              ))}
            </div>
          </section>










          {/* Included / Excluded */}
          <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-stone-900">
                <CheckCircle2 size={17} className="text-orange-600" />
                {t("tourDetail.whatsIncluded")}
              </h3>
              <ul className="space-y-2.5">
                {includedLabels.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                    <CheckCircle2 size={15} className="mt-0.5 flex-none text-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-stone-900">
                <XCircle size={17} className="text-stone-300" />
                {t("tourDetail.notIncluded")}
              </h3>
              <ul className="space-y-2.5">
                {excludedLabels.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-500">
                    <XCircle size={15} className="mt-0.5 flex-none text-stone-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>



        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-5">



            {/* Agency card */}
            <div className="rounded-2xl border border-stone-200 p-6">
              <div className="flex items-center gap-3">
                <img
                  src={`${tour.agency.agency_logo}`}
                  alt={tour.agency.agency_name}
                  className="h-15 w-15 flex-none rounded-[12px] border border-stone-200"
                />

                <div className="min-w-0">
                  <div className="flex flex-col items-start items-center gap-1.5">
                    <div className="flex items-center gap-4">
                      <h3 className="truncate font-semibold flex text-stone-900">{tour.agency.agency_name}</h3>
                      {tour.agency.verification_status === "verified" ?
                        <BadgeCheck className="text-orange-400" size={20} /> : null
                      }
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <LocateFixedIcon
                        size={12}
                      />

                      <span className="font-medium text-stone-700">
                        {tour.agency.agency_city}
                      </span>

                      <span>·</span>
                      <BadgeCheck
                        size={13}
                        className="text-orange-500 fill-blue-500/10"
                        strokeWidth={2}
                      />

                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  onClick={() => setShowPhone((v) => !v)}
                  // disabled={!tour.agency.tel}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Phone size={14} className="text-orange-600" />
                  {t("tourDetail.contact")}
                </button>
                {/* <a
                  href={`mailto:${tour.agency.email}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  <Mail size={14} />
                  Message
                </a> */}
              </div>

              {showPhone && true && (
                <a
                  href={`tel:${tour.agency.tel}`}
                  className="mt-2.5 flex items-center justify-center gap-2 rounded-xl bg-orange-50 py-2.5 text-sm font-semibold text-orange-700"
                >
                  <Phone size={14} />
                  {tour.agency.tel}
                </a>
              )}


              <button
                onClick={() => {
                  if (!Auth) {
                    nav("/login", {
                      state: {
                        from: loc.pathname,
                      },
                    });
                    return;
                  }

                  if (userinfo?.role === "agency") {
                    alert(t("tourDetail.agencyCannotBookAlert"));
                    return;
                  }

                  if (!userinfo?.phone_number) {
                    nav("/profile", {
                      state: {
                        from: loc.pathname,
                      },
                    });
                    return;
                  }

                  setReserveOpen(true);
                }}
                className="mt-5 w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {t("tourDetail.reserveThisTrip")}
              </button>

            </div>






            {/* Booking card */}
            {/* <div className="rounded-2xl border border-stone-200 p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)]">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-stone-900">
                    ${Number(chosen.price).toLocaleString()}
                  </span>
                  <span className="ml-1 text-sm text-stone-400">/ person</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-stone-500">
                  <StarRow rating={tour.rating} size={12} />
                  {tour.rating}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-700">
                <Calendar size={15} className="text-orange-600" />
                {new Date(chosen.departure_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                <span className="ml-auto text-xs text-stone-400">
                  {chosen.available_seats} seats left
                </span>
              </div>


              <button
                onClick={() => setReserveOpen(true)}
                className="mt-5 w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Reserve this trip
              </button>
              <p className="mt-3 text-center text-xs text-stone-400">
                Free cancellation up to 30 days before departure
              </p>
            </div> */}



          </div>
        </div>
      </div>

      {
        reserveOpen && (
          <BookingModalInner
            tour={tour}
            hotels={tour.hotels}
            departures={tour.departures}
            onClose={() => setReserveOpen(false)}
          />
        )
      }

      {
        lightbox && (
          <Lightbox
            images={lightbox.images}
            index={lightbox.index}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        )
      }
    </div >
  );
}