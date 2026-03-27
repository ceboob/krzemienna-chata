"use client";

import { useState } from "react";

export default function Page() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);

  const subject = encodeURIComponent("Zapytanie o pobyt — Krzemienna Chata");
  const body = encodeURIComponent(
    `Dzień dobry,

proszę o potwierdzenie dostępności:

Przyjazd: ${checkIn || "-"}
Wyjazd: ${checkOut || "-"}
Liczba gości: ${guests}

Dziękuję.`
  );

  const bookingHref = `mailto:rezerwacje@twoja-domena.pl?subject=${subject}&body=${body}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f2eb",
        color: "#1c1917",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 20px",
        }}
      >
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: "12px",
            color: "#78716c",
          }}
        >
          Puszcza Knyszyńska · okolice Supraśla
        </p>

        <h1
          style={{
            fontSize: "48px",
            lineHeight: 1.05,
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          Krzemienna Chata
        </h1>

        <p
          style={{
            maxWidth: "700px",
            fontSize: "20px",
            lineHeight: 1.7,
            color: "#44403c",
          }}
        >
          Minimalistyczny dom wakacyjny w lesie, blisko Supraśla. Idealny na
          odpoczynek, pobyt z rodziną, wyjazd z przyjaciółmi i urlop z psem.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gap: "16px",
            maxWidth: "420px",
          }}
        >
          <label>
            <div style={{ marginBottom: "8px" }}>Przyjazd</div>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #d6d3d1",
              }}
            />
          </label>

          <label>
            <div style={{ marginBottom: "8px" }}>Wyjazd</div>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #d6d3d1",
              }}
            />
          </label>

          <label>
            <div style={{ marginBottom: "8px" }}>Liczba gości</div>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #d6d3d1",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <a
            href={bookingHref}
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "14px 20px",
              background: "#1c1917",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "999px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Wyślij zapytanie o pobyt
          </a>
        </div>

        <div
          style={{
            marginTop: "64px",
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {[
            "dom na wyłączność",
            "do 8 gości",
            "kominek",
            "pies mile widziany",
            "blisko Supraśla",
            "Puszcza Knyszyńska",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#fff",
                border: "1px solid #e7e5e4",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
