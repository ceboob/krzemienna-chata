import React, { useEffect, useMemo, useState } from "react"; import { motion } from "framer-motion"; import { Calendar, MapPin, Trees, Flame, Dog, Bike, Bath, Sparkles, ChevronRight, Mail, Phone, Globe } from "lucide-react";

/**

Krzemienna Chata / In The Woods — minimalistyczna strona www

Jak podłączyć prawdziwą synchronizację iCal:

1. Utwórz backend/serverless endpoint np. /api/availability



2. Endpoint powinien pobierać feedy iCal z Booking / Airbnb / AlohaCamp / VRBO itp.



3. Endpoint zwraca listę zajętych dni w formacie ["2026-04-01", "2026-04-02", ...]



4. Podmień API_URL i FEED_LABELS



Dlaczego nie pobieram iCal bezpośrednio w przeglądarce?

Większość feedów iCal ma ograniczenia CORS, więc stabilne rozwiązanie wymaga małego backendu. */


const API_URL = "/api/availability"; const FEED_LABELS = ["Airbnb", "Booking", "AlohaCamp", "VRBO", "Pozostałe portale"];

const fallbackBlockedDates = [ "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-18", "2026-04-19", "2026-05-01", "2026-05-02", "2026-05-03", "2026-05-22", "2026-05-23", "2026-06-19", "2026-06-20" ];

const seo = { name: "Krzemienna Chata pod Supraślem", alternateName: "In The Woods — dom w lesie pod Supraślem", url: "https://twoja-domena.pl", telephone: "+48 000 000 000", email: "rezerwacje@twoja-domena.pl", addressLocality: "Konne / okolice Supraśla", addressRegion: "podlaskie", postalCode: "16-030", addressCountry: "PL", description: "Designerski dom wakacyjny na wyłączność w sercu Puszczy Knyszyńskiej, kilka minut od Supraśla. Do 8 gości, kominek, ruska bania lub jacuzzi, ogrodzony teren, pobyty z psem i bezpośrednia rezerwacja.", keywords: [ "dom w lesie Supraśl", "noclegi Supraśl", "domek w Puszczy Knyszyńskiej", "dom na wyłączność Podlasie", "noclegi z psem Podlasie", "domek z jacuzzi Supraśl", "domek z balią Podlasie", "weekend w Puszczy Knyszyńskiej", "nocleg blisko Supraśla", "dom wakacyjny Podlasie", "Krzemienna Chata", "In The Woods Supraśl" ] };

const highlights = [ { icon: Trees, title: "W samym sercu puszczy", text: "Prywatny dom ukryty pośród sosen i świerków, przy rezerwacie Krzemienne Góry i blisko Supraśla." }, { icon: Sparkles, title: "Estetyka, nie przypadek", text: "Wnętrza z drewna, naturalne tkaniny, spokojna paleta kolorów i detal, który buduje klimat zamiast krzyczeć." }, { icon: Flame, title: "Komfort przez cały rok", text: "Kominek, pełna kuchnia, duży taras, ogród, miejsce na ognisko i wypoczynek niezależnie od sezonu." }, { icon: Dog, title: "Pobyt z psem mile widziany", text: "Ogrodzony teren i ogrom leśnych tras sprawiają, że to świetna baza na urlop z czworonogiem." } ];

const amenities = [ "do 8 gości", "3 strefy spania", "kominek", "pełna kuchnia i jadalnia", "duża łazienka + dodatkowa toaleta", "taras i balkon", "ogród i ogrodzony teren", "miejsce na ognisko i grill", "ruska bania / strefa relaksu", "Wi‑Fi", "parking", "pobyt z psem" ];

const experiences = [ { icon: Bike, title: "Rowery, spacery, szlaki", text: "Leśne drogi i spokojne trasy wokół Supraśla tworzą naturalną bazę do aktywnego wypoczynku." }, { icon: Bath, title: "Wieczory w rytmie slow", text: "Po dniu w puszczy czeka rozgrzana bania lub jacuzzi, drewno, cisza i ciemne niebo pełne gwiazd." }, { icon: MapPin, title: "Blisko atrakcji Podlasia", text: "Supraśl, rzeka, szlaki, Monaster, Muzeum Ikon i Białystok są na tyle blisko, by zwiedzać bez pośpiechu." } ];

const faq = [ { q: "Czy kalendarz jest synchronizowany z portalami rezerwacyjnymi?", a: "Tak. Kalendarz na stronie może być zsynchronizowany przez iCal z Booking, Airbnb, VRBO, AlohaCamp i innymi portalami, dzięki czemu dostępność pozostaje spójna we wszystkich kanałach." }, { q: "Czy można przyjechać z psem?", a: "Tak, obiekt jest przyjazny psom. Ogrodzony teren i leśne ścieżki sprawiają, że pobyt z pupilem jest wygodny i naturalny." }, { q: "Dla ilu osób jest dom?", a: "Dom został zaprojektowany na pobyt do 8 gości i najlepiej sprawdza się na rodzinne wyjazdy, weekend ze znajomymi albo dłuższy workation w rytmie slow." }, { q: "Co wyróżnia to miejsce?", a: "Prywatność, położenie w Puszczy Knyszyńskiej, niepowtarzalne wnętrza z bali, kominek, strefa relaksu oraz klimat, którego nie da się odtworzyć w standardowym apartamencie." } ];

function classNames(...classes) { return classes.filter(Boolean).join(" "); }

function formatISO(date) { return date.toISOString().split("T")[0]; }

function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }

function monthMatrix(anchorDate) { const year = anchorDate.getFullYear(); const month = anchorDate.getMonth(); const firstDay = new Date(year, month, 1); const start = new Date(firstDay); const day = (firstDay.getDay() + 6) % 7; start.setDate(firstDay.getDate() - day);

const days = []; for (let i = 0; i < 42; i++) { days.push(addDays(start, i)); } return days; }

function DatePill({ children, active }) { return ( <span className={classNames( "inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-[0.18em] uppercase", active ? "border-stone-900 bg-stone-900 text-stone-50" : "border-stone-300 bg-stone-50 text-stone-700" )} > {children} </span> ); }

export default function KrzemiennaChataSite() { const [blockedDates, setBlockedDates] = useState(fallbackBlockedDates); const [month, setMonth] = useState(() => new Date()); const [checkIn, setCheckIn] = useState(""); const [checkOut, setCheckOut] = useState(""); const [guests, setGuests] = useState(4); const [status, setStatus] = useState("Ładowanie dostępności...");

useEffect(() => { let ignore = false; async function loadAvailability() { try { const res = await fetch(API_URL); if (!res.ok) throw new Error("API unavailable"); const data = await res.json(); if (!ignore && Array.isArray(data?.blockedDates)) { setBlockedDates(data.blockedDates); setStatus("Kalendarz zsynchronizowany z iCal."); return; } throw new Error("Invalid payload"); } catch { if (!ignore) { setBlockedDates(fallbackBlockedDates); setStatus("Tryb demonstracyjny — podłącz iCal przez backend, aby pokazać aktualną dostępność."); } } } loadAvailability(); return () => { ignore = true; }; }, []);

const blocked = useMemo(() => new Set(blockedDates), [blockedDates]); const days = useMemo(() => monthMatrix(month), [month]);

const nights = useMemo(() => { if (!checkIn || !checkOut) return 0; const start = new Date(checkIn); const end = new Date(checkOut); const diff = Math.round((end.getTime() - start.getTime()) / 86400000); return diff > 0 ? diff : 0; }, [checkIn, checkOut]);

const isBlockedRange = useMemo(() => { if (!checkIn || !checkOut || !nights) return false; let cursor = new Date(checkIn); while (formatISO(cursor) < checkOut) { if (blocked.has(formatISO(cursor))) return true; cursor = addDays(cursor, 1); } return false; }, [checkIn, checkOut, nights, blocked]);

const bookingHref = useMemo(() => { const subject = encodeURIComponent("Zapytanie o pobyt — Krzemienna Chata"); const body = encodeURIComponent( Dzień dobry,%0D%0A%0D%0Aproszę o potwierdzenie dostępności:%0D%0A + Przyjazd: ${checkIn || "-"}%0D%0A + Wyjazd: ${checkOut || "-"}%0D%0A + Liczba gości: ${guests}%0D%0A + Liczba nocy: ${nights || "-"}%0D%0A%0D%0A + Dziękuję. ); return mailto:${seo.email}?subject=${subject}&body=${body}; }, [checkIn, checkOut, guests, nights]);

const structuredData = { "@context": "https://schema.org", "@type": "VacationRental", name: seo.name, alternateName: seo.alternateName, description: seo.description, url: seo.url, telephone: seo.telephone, email: seo.email, petsAllowed: true, maximumAttendeeCapacity: 8, address: { "@type": "PostalAddress", addressLocality: seo.addressLocality, addressRegion: seo.addressRegion, postalCode: seo.postalCode, addressCountry: seo.addressCountry }, amenityFeature: amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })), keywords: seo.keywords.join(", "), checkinTime: "14:30", checkoutTime: "11:30" };

return ( <div className="min-h-screen bg-[#f6f2eb] text-stone-900 selection:bg-stone-900 selection:text-stone-50"> <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

<div className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-[#f6f2eb]/85 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Puszcza Knyszyńska</div>
        <div className="text-lg font-medium">Krzemienna Chata</div>
      </div>
      <div className="hidden items-center gap-6 text-sm text-stone-600 md:flex">
        <a href="#o-obiekcie" className="hover:text-stone-900">O obiekcie</a>
        <a href="#dostepnosc" className="hover:text-stone-900">Dostępność</a>
        <a href="#okolica" className="hover:text-stone-900">Okolica</a>
        <a href="#seo" className="hover:text-stone-900">Dlaczego tu trafisz</a>
      </div>
    </div>
  </div>

  <section className="relative overflow-hidden px-5 pb-14 pt-28 md:px-8 md:pb-24 md:pt-36">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,113,108,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(41,37,36,0.08),transparent_30%)]" />
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <DatePill>dom na wyłączność · do 8 gości</DatePill>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
          Minimalistyczny azyl w lesie,
          <span className="block text-stone-500">kilka minut od Supraśla.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 md:text-xl">
          Drewniany dom z charakterem, kominkiem i prywatną strefą relaksu. Dla tych, którzy szukają ciszy,
          estetyki i prawdziwego Podlasia — bez pośpiechu, bez tłoku, bez kompromisów.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#dostepnosc"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
          >
            Sprawdź dostępność
          </a>
          <a
            href="#o-obiekcie"
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
          >
            Poznaj dom
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <DatePill>kominek</DatePill>
          <DatePill>ogrodzony teren</DatePill>
          <DatePill>bania / jacuzzi</DatePill>
          <DatePill>pies mile widziany</DatePill>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-stone-200 bg-[#d9d0c2] p-5 shadow-[0_30px_80px_rgba(41,37,36,0.12)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(60,60,60,0.18),transparent_22%),linear-gradient(180deg,#cbc0b1,#b6aa9a_45%,#8f826f)]" />
        <div className="relative flex h-full flex-col justify-between rounded-[26px] border border-white/40 bg-white/10 p-6 backdrop-blur-[2px]">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-stone-700">
              <span>Unikalny dom wakacyjny</span>
              <span>Podlasie</span>
            </div>
            <div className="mt-6 text-3xl font-medium leading-tight text-stone-900 md:text-4xl">
              Drewno, światło,
              <br />
              cisza i zapach lasu.
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-[24px] bg-[#f6f2eb]/88 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Położenie</div>
              <div className="mt-2 text-lg">Puszcza Knyszyńska · okolice Supraśla</div>
            </div>
            <div className="rounded-[24px] bg-stone-900 p-4 text-stone-50">
              <div className="text-xs uppercase tracking-[0.2em] text-stone-400">Dla kogo</div>
              <div className="mt-2 text-lg">Rodziny, pary, przyjaciele, workation, pobyty z psem</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>

  <section id="o-obiekcie" className="px-5 py-14 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-500">O obiekcie</div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
          Dom, który nie udaje hotelu.
        </h2>
        <p className="mt-5 text-base leading-8 text-stone-700 md:text-lg">
          To miejsce stworzone dla osób, które wolą prawdziwy charakter od przewidywalności. Zamiast anonimowego
          apartamentu — dom z bali, salon z kominkiem, kuchnia z klimatem, taras na poranną kawę i ogród, w którym
          rytm dnia wyznacza światło, pogoda i śpiew ptaków.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-medium">{item.title}</h3>
              <p className="mt-3 leading-7 text-stone-600">{item.text}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[28px] border border-stone-200 bg-stone-900 p-7 text-stone-50">
          <div className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Najważniejsze udogodnienia</div>
          <div className="mt-6 flex flex-wrap gap-2">
            {amenities.map((item) => (
              <span key={item} className="rounded-full border border-stone-700 px-3 py-2 text-sm text-stone-200">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-[#efe7da] p-7">
          <p className="text-lg leading-8 text-stone-800 md:text-xl">
            Krzemienna Chata najlepiej działa wtedy, gdy obiecuje mniej, a daje więcej: prywatność, przestrzeń,
            estetykę i bliskość natury. To właśnie dlatego tak dobrze sprawdza się na romantyczny weekend, rodzinne
            ferie, kameralne święta, pobyt z przyjaciółmi albo kilka dni offline w środku lasu.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="dostepnosc" className="border-y border-stone-200 bg-white px-5 py-14 md:px-8 md:py-24">
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Rezerwacja</div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
          Kalendarz dostępności zsynchronizowany z iCal.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-stone-700 md:text-lg">
          Jeden kalendarz, wiele kanałów sprzedaży. Strona może pobierać zajęte terminy z najważniejszych portali,
          dzięki czemu gość widzi realną dostępność, a ryzyko podwójnej rezerwacji spada praktycznie do zera.
        </p>
        <div className="mt-6 rounded-[24px] bg-[#f6f2eb] p-5 text-sm leading-7 text-stone-700">
          <div className="font-medium text-stone-900">Źródła synchronizacji</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {FEED_LABELS.map((name) => (
              <span key={name} className="rounded-full border border-stone-300 px-3 py-1.5">{name}</span>
            ))}
          </div>
          <div className="mt-4 text-stone-600">{status}</div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block rounded-[22px] border border-stone-200 p-4">
            <span className="text-sm text-stone-500">Przyjazd</span>
            <input
              type="date"
              value={checkIn}
              min={formatISO(new Date())}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-2 w-full bg-transparent text-lg outline-none"
            />
          </label>
          <label className="block rounded-[22px] border border-stone-200 p-4">
            <span className="text-sm text-stone-500">Wyjazd</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || formatISO(new Date())}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-2 w-full bg-transparent text-lg outline-none"
            />
          </label>
        </div>

        <label className="mt-4 block rounded-[22px] border border-stone-200 p-4">
          <span className="text-sm text-stone-500">Liczba gości</span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-2 w-full bg-transparent text-lg outline-none"
          >
            {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} {n === 1 ? "gość" : n < 5 ? "gości" : "gości"}</option>)}
          </select>
        </label>

        <div className="mt-5 rounded-[22px] bg-stone-900 p-5 text-stone-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-stone-400">Podsumowanie</div>
              <div className="mt-1 text-2xl font-medium">{nights ? `${nights} noc${nights === 1 ? "" : nights < 5 ? "e" : "y"}` : "Wybierz termin"}</div>
            </div>
            <Calendar className="opacity-70" />
          </div>
          <div className="mt-4 text-sm leading-7 text-stone-300">
            {isBlockedRange
              ? "Wybrany zakres obejmuje niedostępne dni. Zmień termin lub skontaktuj się bezpośrednio w sprawie alternatywy."
              : "Po wysłaniu zapytania możesz potwierdzić rezerwację bezpośrednio albo przekierować gościa do wybranego portalu."}
          </div>
          <a
            href={bookingHref}
            className={classNames(
              "mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
              isBlockedRange || !nights
                ? "pointer-events-none bg-stone-700 text-stone-400"
                : "bg-[#efe7da] text-stone-900 hover:bg-white"
            )}
          >
            Wyślij zapytanie o pobyt
            <ChevronRight size={16} />
          </a>
        </div>
      </div>

      <div className="rounded-[30px] border border-stone-200 bg-[#f9f7f3] p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:border-stone-900"
          >
            ←
          </button>
          <div className="text-lg font-medium capitalize">
            {month.toLocaleDateString("pl-PL", { month: "long", year: "numeric" })}
          </div>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:border-stone-900"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.2em] text-stone-500">
          {["Pn","Wt","Śr","Cz","Pt","So","Nd"].map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date) => {
            const iso = formatISO(date);
            const inCurrentMonth = date.getMonth() === month.getMonth();
            const unavailable = blocked.has(iso);
            const selected = iso === checkIn || iso === checkOut;
            const isPast = new Date(iso) < new Date(formatISO(new Date()));
            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  if (unavailable || isPast) return;
                  if (!checkIn || (checkIn && checkOut)) {
                    setCheckIn(iso);
                    setCheckOut("");
                    return;
                  }
                  if (iso > checkIn) {
                    setCheckOut(iso);
                  } else {
                    setCheckIn(iso);
                    setCheckOut("");
                  }
                }}
                className={classNames(
                  "aspect-square rounded-2xl border text-sm transition",
                  !inCurrentMonth && "opacity-35",
                  unavailable && "border-stone-200 bg-stone-200 text-stone-400 line-through",
                  selected && "border-stone-900 bg-stone-900 text-stone-50",
                  !unavailable && !selected && inCurrentMonth && !isPast && "border-stone-200 bg-white hover:border-stone-900",
                  isPast && "cursor-not-allowed border-stone-100 bg-stone-100 text-stone-300"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-stone-600">
          <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-white ring-1 ring-stone-300" /> Dostępne</div>
          <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-stone-900" /> Wybrane</div>
          <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-stone-300" /> Zajęte z iCal</div>
        </div>
      </div>
    </div>
  </section>

  <section id="okolica" className="px-5 py-14 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Okolica</div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
            Slow travel w wersji podlaskiej.
          </h2>
        </div>
        <p className="text-base leading-8 text-stone-700 md:text-lg">
          Wokół czeka wszystko, czego zwykle szuka się daleko: las, rzeka, rowerowe szutry, grzybobranie, kajaki,
          obserwacja gwiazd i Supraśl z jego spokojną, uzdrowiskową energią. To idealna baza dla gości, którzy chcą
          odpocząć, ale nie nudzić się ciszą.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {experiences.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="rounded-[28px] border border-stone-200 bg-white p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-medium">{item.title}</h3>
              <p className="mt-3 leading-7 text-stone-600">{item.text}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-[30px] border border-stone-200 bg-[#efe7da] p-7">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Supraśl i jego uzdrowiskowy klimat",
            "Monaster i Muzeum Ikon",
            "Rezerwat Krzemienne Góry",
            "Leśne trasy piesze i rowerowe",
            "Rzeka Supraśl i aktywności nad wodą",
            "Białystok w zasięgu krótkiego dojazdu",
            "Jesienne grzybobranie i zimowe wyciszenie",
            "Wypady z psem bez miejskiego stresu"
          ].map((item) => (
            <div key={item} className="rounded-[22px] bg-white/75 px-4 py-5 text-stone-800">{item}</div>
          ))}
        </div>
      </div>
    </div>
  </section>

  <section id="seo" className="border-y border-stone-200 bg-stone-900 px-5 py-14 text-stone-50 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-400">SEO i widoczność</div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
          Strona napisana pod wyszukiwarkę i pod decyzję rezerwacyjną.
        </h2>
        <p className="mt-5 text-base leading-8 text-stone-300 md:text-lg">
          Treść celowo łączy język emocji z językiem intencji zakupowej: dom w lesie, noclegi Supraśl, Puszcza
          Knyszyńska, pobyt z psem, dom na wyłączność, jacuzzi lub bania. Dzięki temu strona pracuje równocześnie na
          ruch brandowy, lokalny i długi ogon.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-stone-800 bg-stone-950 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-stone-500">Frazy główne</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {seo.keywords.slice(0, 6).map((k) => (
              <span key={k} className="rounded-full border border-stone-700 px-3 py-2 text-sm text-stone-200">{k}</span>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-stone-800 bg-stone-950 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-stone-500">Frazy wspierające</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {seo.keywords.slice(6).map((k) => (
              <span key={k} className="rounded-full border border-stone-700 px-3 py-2 text-sm text-stone-200">{k}</span>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-stone-800 bg-stone-950 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-stone-500">Elementy techniczne</div>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
            <li>schema.org VacationRental</li>
            <li>sekcje pod lokalne intencje wyszukiwania</li>
            <li>czytelna hierarchia H1–H2–H3</li>
            <li>treści pod rich results i SEO lokalne</li>
            <li>naturalne CTA zwiększające konwersję</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section className="px-5 py-14 md:px-8 md:py-24">
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-500">FAQ</div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">Pytania, które sprzedają spokój.</h2>
      </div>
      <div className="space-y-4">
        {faq.map((item) => (
          <div key={item.q} className="rounded-[24px] border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-medium">{item.q}</h3>
            <p className="mt-3 leading-7 text-stone-600">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <footer className="border-t border-stone-200 px-5 py-10 md:px-8">
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Kontakt i rezerwacje</div>
        <div className="mt-3 text-2xl font-medium md:text-3xl">Krzemienna Chata pod Supraślem</div>
        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Strona została zaprojektowana tak, aby wspierać zarówno rezerwacje bezpośrednie, jak i ruch z wyników
          organicznych Google. Podmień dane kontaktowe, zdjęcia i feedy iCal, a projekt będzie gotowy do wdrożenia.
        </p>
      </div>
      <div className="space-y-3 text-sm text-stone-700">
        <div className="flex items-center gap-3"><Mail size={16} /> {seo.email}</div>
        <div className="flex items-center gap-3"><Phone size={16} /> {seo.telephone}</div>
        <div className="flex items-center gap-3"><MapPin size={16} /> {seo.addressLocality}, {seo.addressRegion}</div>
        <div className="flex items-center gap-3"><Globe size={16} /> {seo.url}</div>
      </div>
    </div>
  </footer>
</div>

); }
