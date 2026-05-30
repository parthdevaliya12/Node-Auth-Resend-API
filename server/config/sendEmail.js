import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "E-commerce <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });
    return data;
  } catch (error) {
    console.error("Resend email failed:", error);
    throw error;
  }
};

export default sendEmail;