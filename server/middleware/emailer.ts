// middleware/emailer.ts
import "bun";
import { Resend } from "resend";
import logger from "./logger";

const resend = new Resend(process.env.EMAIL);

export const send = async (
  receiver: string,
  passcode: number
): Promise<String> => {
  const success: string = "success",
    fail: string = "fail";
  try {
    await resend.emails.send({
      from: "no-reply@glasscube.io",
      to: receiver,
      replyTo: "support@glasscube.io",
      subject: "One time passcode arrived.",
      html: `<p>Sir one time passcode has been sent 
            <strong>${passcode}<strong>
            please complete the authentication to carry on.<p>`,
    });
    return success;
  } catch (error) {
    logger.error("erro happened while sending email "+ error);
    return fail;
  }
};
