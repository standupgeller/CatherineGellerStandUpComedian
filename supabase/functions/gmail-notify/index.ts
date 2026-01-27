import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ContactRequest = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  recipientEmail?: string | null;
};

const base64UrlEncode = (str: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const getAccessToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string | null> => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    console.error("Failed to refresh Gmail access token", await res.text());
    return null;
  }

  const json = await res.json();
  return json.access_token as string;
};

const sendGmail = async (
  accessToken: string,
  senderEmail: string,
  toEmail: string,
  subject: string,
  htmlBody: string,
): Promise<boolean> => {
  const mime = [
    `From: Contact Form <${senderEmail}>`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    htmlBody,
  ].join("\n");

  const raw = base64UrlEncode(mime);

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    console.error("Gmail send failed", await res.text());
    return false;
  }

  return true;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, recipientEmail }: ContactRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const toEmail = recipientEmail || "admin@example.com";

    const clientId = Deno.env.get("GMAIL_CLIENT_ID");
    const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");
    const senderEmail = Deno.env.get("GMAIL_SENDER_EMAIL") || toEmail;

    if (!clientId || !clientSecret || !refreshToken) {
      console.warn("Gmail credentials missing; skipping email send");
      return new Response(
        JSON.stringify({ success: true, sent: false }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to obtain Gmail access token" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const title = subject ? `Contact Form: ${subject}` : "New Contact Form Submission";
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const sent = await sendGmail(accessToken, senderEmail, toEmail, title, html);

    return new Response(
      JSON.stringify({ success: true, sent }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    console.error("gmail-notify error", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
