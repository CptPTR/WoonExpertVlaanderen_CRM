import TypeKeuring from "@/models/TypeKeuring";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request) {
  const requestData = await request.json();

  const event = {
    summary: `${requestData.type.replace("/", " + ")} - ${
      requestData.straatnaam
    } ${requestData.nummer}, ${requestData.postcode} ${requestData.gemeente}`,
    location: `${requestData.straatnaam} ${requestData.nummer}, ${requestData.postcode} ${requestData.gemeente}`,
    description: `${requestData.type.replace("/", " + ")} keuring\n${
      requestData.voornaam
    } ${requestData.familienaam}\n${requestData.emailadres}\n${
      requestData.telefoonnummer
    }`,
    start: {
      dateTime: requestData.datumPlaatsbezoek,
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(requestData.datumPlaatsbezoek),
      timeZone: "UTC",
    },
  };

  const newEndDate = new Date(event.end.dateTime);
  newEndDate.setHours(newEndDate.getHours() + 1);
  newEndDate.setMinutes(newEndDate.getMinutes() + 30);
  event.end.dateTime = newEndDate.toISOString();

  const auth = new google.auth.JWT({
    email: process.env.NEXT_PUBLIC_CRED_CLIENT_EMAIL,
    key: process.env.NEXT_PUBLIC_CRED_PRIVATE_KEY,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const insertEventPromise = new Promise(async (resolve, reject) => {
    let resolveObject = {
      event_id: "",
      event_id_asbest: "",
    };
    if (requestData.type.includes(TypeKeuring.ASBEST)) {
      calendar.events.insert(
        {
          calendarId: process.env.NEXT_PUBLIC_GMAIL_ASBEST,
          requestBody: event,
        },
        (err, response) => {
          if (err) {
            console.error("Error toevoeging event: ", err);
            reject(err);
            return;
          }

          resolveObject = {
            ...resolveObject,
            event_id_asbest: response.data.id,
          };
        }
      );
    }

    calendar.events.insert(
      {
        calendarId: process.env.NEXT_PUBLIC_GMAIL_EPC_ASBEST,
        requestBody: event,
      },
      (err, response) => {
        if (err) {
          console.error("Error toevoeging event: ", err);
          reject(err);
          return;
        }

        resolveObject = { ...resolveObject, event_id: response.data.id };
        resolve(resolveObject);
      }
    );
  });

  try {
    const resolveObject = await insertEventPromise;

    let responseData = {
      resolveObject: resolveObject,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Server-side error: ", error);
    return NextResponse.json({ error: "An error has occurred on the server" });
  }
}
