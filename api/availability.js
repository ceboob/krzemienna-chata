export default async function handler(req, res) {
  const feeds = [
    "TU_WKLEJ_ICAL_AIRBNB",
    "TU_WKLEJ_ICAL_BOOKING",
    "TU_WKLEJ_ICAL_ALOHACAMP",
    "TU_WKLEJ_ICAL_VRBO"
  ];

  const blockedDates = new Set();

  for (const url of feeds) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      const events = text.split("BEGIN:VEVENT");

      events.forEach(event => {
        const start = event.match(/DTSTART.*:(\\d{8})/);
        const end = event.match(/DTEND.*:(\\d{8})/);

        if (start && end) {
          let current = new Date(formatDate(start[1]));
          const last = new Date(formatDate(end[1]));

          while (current < last) {
            blockedDates.add(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
          }
        }
      });

    } catch (e) {
      console.log("Błąd feedu:", url);
    }
  }

  res.status(200).json({
    blockedDates: Array.from(blockedDates)
  });
}

function formatDate(str) {
  return `${str.slice(0,4)}-${str.slice(4,6)}-${str.slice(6,8)}`;
}
