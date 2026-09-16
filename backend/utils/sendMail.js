import { Resend } from "resend";

// =====================================================
// CONFIG
// =====================================================

const BRAND_NAME = "Blog Application";
const BRAND_LOGO = "📝";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not configured");
}

if (!EMAIL_FROM) {
  console.warn("⚠️ EMAIL_FROM is not configured");
}

const resend = new Resend(RESEND_API_KEY);

// =====================================================
// COMMON EMAIL WRAPPER
// =====================================================

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${BRAND_NAME}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:#f3f4f6;
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
  "
>
  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
      background-color:#f3f4f6;
      padding:40px 16px;
    "
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width:520px;
            background-color:#ffffff;
            border-radius:16px;
            box-shadow:0 4px 24px rgba(0,0,0,0.06);
            overflow:hidden;
          "
        >
          ${content}
        </table>

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width:520px;
            margin-top:24px;
          "
        >
          <tr>
            <td
              align="center"
              style="
                color:#9ca3af;
                font-size:12px;
                line-height:1.6;
              "
            >
              <p style="margin:0 0 4px 0;">
                © ${new Date().getFullYear()}
                ${BRAND_NAME}. All rights reserved.
              </p>

              <p style="margin:0;">
                If you didn't request this,
                you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

// =====================================================
// EMAIL HEADER
// =====================================================

const emailHeader = () => `
<tr>
  <td
    style="
      background:linear-gradient(
        135deg,
        #111827 0%,
        #1f2937 100%
      );
      padding:32px;
      text-align:center;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
    >
      <tr>
        <td align="center">

          <div
            style="
              display:inline-block;
              width:56px;
              height:56px;
              background-color:#ea580c;
              border-radius:14px;
              line-height:56px;
              text-align:center;
              font-size:26px;
              margin-bottom:12px;
            "
          >
            ${BRAND_LOGO}
          </div>

          <h1
            style="
              margin:0;
              color:#ffffff;
              font-size:20px;
              font-weight:600;
              letter-spacing:0.3px;
            "
          >
            ${BRAND_NAME}
          </h1>

        </td>
      </tr>
    </table>
  </td>
</tr>
`;

// =====================================================
// OTP BOX
// =====================================================

const otpBox = (otp) => `
<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="margin:28px 0;"
>
  <tr>
    <td align="center">

      <div
        style="
          display:inline-block;
          background-color:#f9fafb;
          border:2px dashed #d1d5db;
          border-radius:12px;
          padding:20px 32px;
        "
      >
        <p
          style="
            margin:0 0 8px 0;
            color:#6b7280;
            font-size:12px;
            text-transform:uppercase;
            letter-spacing:1.5px;
            font-weight:600;
          "
        >
          Your OTP Code
        </p>

        <p
          style="
            margin:0;
            color:#111827;
            font-size:38px;
            font-weight:700;
            letter-spacing:10px;
            font-family:'Courier New', monospace;
          "
        >
          ${otp}
        </p>
      </div>

    </td>
  </tr>
</table>
`;

// =====================================================
// INFO BOX
// =====================================================

const infoBox = (text) => `
<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="margin-top:24px;"
>
  <tr>
    <td
      style="
        background-color:#fef3c7;
        border-left:4px solid #f59e0b;
        border-radius:8px;
        padding:12px 16px;
      "
    >
      <p
        style="
          margin:0;
          color:#92400e;
          font-size:13px;
          line-height:1.5;
        "
      >
        ⏱️ ${text}
      </p>
    </td>
  </tr>
</table>
`;

// =====================================================
// SAFE SEND
// =====================================================

const safeSend = async ({
  to,
  subject,
  html,
  type,
}) => {
  const start = Date.now();

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    if (!EMAIL_FROM) {
      throw new Error("EMAIL_FROM is missing");
    }

    console.log(
      `📧 [${type}] Sending email to ${to}...`
    );

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error(
        `❌ [${type}] Resend failed:`,
        error
      );

      throw new Error(
        error.message || "Email sending failed"
      );
    }

    console.log(
      `✅ [${type}] Email sent successfully`
    );

    console.log(
      `📨 Message ID: ${data?.id || "N/A"}`
    );

    console.log(
      `⏱️ Time: ${Date.now() - start}ms`
    );

    return data;

  } catch (error) {

    console.error(
      `❌ [${type}] EMAIL ERROR:`,
      {
        message: error.message,
      }
    );

    throw error;
  }
};

// =====================================================
// PASSWORD RESET OTP
// =====================================================

export const sendMail = async (
  email,
  otp
) => {

  const content = `
    ${emailHeader()}

    <tr>
      <td
        style="
          padding:36px 32px 32px 32px;
        "
      >

        <h2
          style="
            margin:0 0 8px 0;
            color:#111827;
            font-size:22px;
            font-weight:700;
          "
        >
          Password Reset Request 🔐
        </h2>

        <p
          style="
            margin:0;
            color:#6b7280;
            font-size:14px;
            line-height:1.6;
          "
        >
          We received a request to reset your
          <b style="color:#111827;">
            ${BRAND_NAME}
          </b>
          account password.
          Use the OTP below to proceed.
          This code is valid for
          <b style="color:#111827;">
            5 minutes
          </b>.
        </p>

        ${otpBox(otp)}

        ${infoBox(
          "Never share this code with anyone. Our team will never ask for it."
        )}

        <p
          style="
            margin:24px 0 0 0;
            color:#9ca3af;
            font-size:12px;
            line-height:1.6;
          "
        >
          If you didn't request a password reset,
          you can safely ignore this email.
        </p>

      </td>
    </tr>
  `;

  return safeSend({
    to: email,
    subject:
      `🔐 Password Reset OTP - ${BRAND_NAME}`,
    html: emailWrapper(content),
    type: "PASSWORD_RESET",
  });
};

// =====================================================
// EMAIL VERIFICATION OTP
// =====================================================

export const sendVerificationMail = async (
  email,
  otp,
  firstName = "User"
) => {

  const content = `
    ${emailHeader()}

    <tr>
      <td
        style="
          padding:36px 32px 32px 32px;
        "
      >

        <h2
          style="
            margin:0 0 8px 0;
            color:#111827;
            font-size:22px;
            font-weight:700;
          "
        >
          Welcome, ${firstName}! 👋
        </h2>

        <p
          style="
            margin:0;
            color:#6b7280;
            font-size:14px;
            line-height:1.6;
          "
        >
          Thanks for signing up with
          <b style="color:#111827;">
            ${BRAND_NAME}
          </b>.

          To complete your registration,
          please verify your email using
          the OTP below.
        </p>

        ${otpBox(otp)}

        ${infoBox(
          "This verification code will expire in 10 minutes."
        )}

        <p
          style="
            margin:24px 0 0 0;
            color:#9ca3af;
            font-size:12px;
            line-height:1.6;
          "
        >
          If you didn't create an account on
          ${BRAND_NAME},
          please ignore this email.
        </p>

      </td>
    </tr>
  `;

  return safeSend({
    to: email,
    subject:
      `✉️ Verify Your Email - ${BRAND_NAME}`,
    html: emailWrapper(content),
    type: "VERIFICATION",
  });
};

// =====================================================
// WELCOME EMAIL
// =====================================================

export const sendWelcomeMail = async (
  email,
  firstName = "User"
) => {

  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const content = `
    ${emailHeader()}

    <tr>
      <td
        style="
          padding:36px 32px 32px 32px;
        "
      >

        <h2
          style="
            margin:0 0 8px 0;
            color:#111827;
            font-size:22px;
            font-weight:700;
          "
        >
          You're all set, ${firstName}! 🎉
        </h2>

        <p
          style="
            margin:0;
            color:#6b7280;
            font-size:14px;
            line-height:1.6;
          "
        >
          Your email has been verified successfully.
          Welcome to
          <b style="color:#111827;">
            ${BRAND_NAME}
          </b>!
        </p>

        <table
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="margin:24px auto 0 auto;"
        >
          <tr>
            <td
              align="center"
              style="
                border-radius:10px;
                background-color:#ea580c;
              "
            >
              <a
                href="${frontendUrl}/login"
                target="_blank"
                style="
                  display:inline-block;
                  padding:14px 32px;
                  font-size:14px;
                  font-weight:600;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:10px;
                "
              >
                Go to Login
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  `;

  return safeSend({
    to: email,
    subject:
      `🎉 Welcome to ${BRAND_NAME}!`,
    html: emailWrapper(content),
    type: "WELCOME",
  });
};