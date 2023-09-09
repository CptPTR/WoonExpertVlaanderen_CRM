import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const slug = params.slug;
  const currentYear = new Date().getFullYear();
  const lastDay = new Date(2023, slug, 0).getDate();

  const auth = new google.auth.JWT({
    email: process.env.NEXT_PUBLIC_CRED_CLIENT_EMAIL,
    key: process.env.NEXT_PUBLIC_CRED_PRIVATE_KEY,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    const res = await calendar.events.list({
      calendarId: process.env.NEXT_PUBLIC_GMAIL_EPC_ASBEST,
      // calendarId: "dclercqpeter@gmail.com",
      timeMin: new Date(currentYear, slug - 1, 1),
      timeMax: new Date(currentYear, slug - 1, lastDay + 1),
      singleEvents: true,
    });

    if (res.data) {
      const data = await res.data.items.map((event) => event.start.dateTime);
      return NextResponse.json({ data });
    } else {
      return;
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.error("An error occurred");
  }
}
