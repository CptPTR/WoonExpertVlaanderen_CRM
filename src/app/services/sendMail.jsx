"use server";

import nodemailer from "nodemailer";

export const sendNotifMail = async (madeBy, type, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_NOTIF_SENDER_USERNAME,
        pass: process.env.NEXT_PUBLIC_GMAIL_NOTIF_SENDER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_GMAIL_NOTIF_SENDER_USERNAME,
      to: process.env.NEXT_PUBLIC_NOTIFICATION_RECEIVER,
      subject: `Nieuwe keuring aangemaakt door ${madeBy}`,
      html: `<p>Er is een nieuwe keuringsaanvraag binnengekomen voor ${type}.</p><p>Bekijk de details van deze keuring via de volgende link: <a href="${link}">link</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Error sending mail" };
  }
};
