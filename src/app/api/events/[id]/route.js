import creds from "@/credentials.json";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    const auth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    });
    const calendar = google.calendar({ version: "v3", auth });

    console.log("delete Event ID: ", id);

    await calendar.events.delete({
      calendarId: process.env.NEXT_PUBLIC_GMAIL_EPC_ASBEST,
      eventId: id,
    });
    return NextResponse.json(
      { message: "Successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
