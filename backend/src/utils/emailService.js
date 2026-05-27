const nodemailer = require('nodemailer');

let transporter = null;

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP not configured — email notifications disabled.');
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

const getTransporter = () => {
  if (!transporter) transporter = createTransporter();
  return transporter;
};

// ── HTML email templates ─────────────────────────────────────────────
const enquiryEmailHTML = ({ name, email, phone, business_name, service_type, message }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Enquiry – Smart Art</title>
</head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a14;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e,#0d0d1a);border-radius:16px 16px 0 0;padding:40px 40px 32px;border:1px solid rgba(245,166,35,0.25);border-bottom:none;text-align:center;">
            <div style="font-family:monospace;font-size:28px;font-weight:900;letter-spacing:4px;background:linear-gradient(135deg,#ffd166,#f5a623);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">SMART ART</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:3px;margin-top:4px;text-transform:uppercase;">Nashik, Maharashtra</div>
            <div style="margin-top:24px;display:inline-block;background:rgba(245,166,35,0.12);border:1px solid rgba(245,166,35,0.35);border-radius:100px;padding:8px 20px;">
              <span style="color:#f5a623;font-size:13px;font-weight:600;letter-spacing:1px;">🔔 NEW ENQUIRY RECEIVED</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#111120;padding:36px 40px;border:1px solid rgba(245,166,35,0.25);border-top:none;border-bottom:none;">
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 28px;">
              You have received a new business enquiry through your website. Here are the client details:
            </p>

            <!-- Detail rows -->
            ${[
              { label: '👤 Client Name', value: name },
              email ? { label: '✉️ Email', value: `<a href="mailto:${email}" style="color:#f5a623;text-decoration:none;">${email}</a>` } : null,
              phone ? { label: '📞 Phone', value: `<a href="tel:${phone}" style="color:#f5a623;text-decoration:none;">${phone}</a>` } : null,
              business_name ? { label: '🏢 Business', value: business_name } : null,
              service_type ? { label: '🔧 Service Needed', value: service_type } : null,
            ].filter(Boolean).map(row => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td width="160" style="background:#0c0c18;border:1px solid rgba(255,255,255,0.07);border-radius:8px 0 0 8px;padding:14px 18px;vertical-align:top;">
                  <span style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">${row.label}</span>
                </td>
                <td style="background:#0f0f1e;border:1px solid rgba(255,255,255,0.07);border-left:none;border-radius:0 8px 8px 0;padding:14px 18px;vertical-align:top;">
                  <span style="color:#f0f0f8;font-size:14px;">${row.value}</span>
                </td>
              </tr>
            </table>`).join('')}

            <!-- Message -->
            <div style="margin-top:24px;">
              <div style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;">💬 Message</div>
              <div style="background:#0c0c18;border:1px solid rgba(245,166,35,0.2);border-left:3px solid #f5a623;border-radius:0 8px 8px 0;padding:18px 20px;color:#d0d0e0;font-size:14px;line-height:1.8;">${message}</div>
            </div>

            <!-- Action buttons -->
            <div style="margin-top:32px;text-align:center;">
              ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g,'')}" style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:6px 8px;">💬 Reply on WhatsApp</a>` : ''}
              ${email ? `<a href="mailto:${email}?subject=Re: Your enquiry at Smart Art&body=Dear ${name},%0D%0A%0D%0AThank you for contacting Smart Art..." style="display:inline-block;background:linear-gradient(135deg,#f5a623,#c77c0a);color:#000;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:6px 8px;">✉️ Reply by Email</a>` : ''}
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0c0c18;border:1px solid rgba(245,166,35,0.25);border-top:2px solid rgba(245,166,35,0.2);border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">
              This notification was sent from your <strong style="color:rgba(245,166,35,0.5);">Smart Art</strong> website.<br/>
              Nashik, Maharashtra · <a href="mailto:info@smartart.in" style="color:rgba(245,166,35,0.5);text-decoration:none;">info@smartart.in</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

const autoReplyHTML = ({ name, service_type }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a14;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e,#0d0d1a);border-radius:16px 16px 0 0;padding:40px 40px 32px;border:1px solid rgba(245,166,35,0.25);border-bottom:none;text-align:center;">
            <div style="font-family:monospace;font-size:28px;font-weight:900;letter-spacing:4px;color:#f5a623;">SMART ART</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:3px;margin-top:4px;">NASHIK, MAHARASHTRA</div>
          </td>
        </tr>
        <tr>
          <td style="background:#111120;padding:40px;border:1px solid rgba(245,166,35,0.25);border-top:none;border-bottom:none;">
            <h2 style="color:#f5a623;font-size:22px;margin:0 0 20px;">Thank You, ${name}! 🙏</h2>
            <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.8;margin:0 0 16px;">
              We've received your enquiry${service_type ? ` for <strong style="color:#f5a623;">${service_type}</strong>` : ''} and we're excited to help!
            </p>
            <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.8;margin:0 0 28px;">
              Our team will get back to you within <strong style="color:#06d6a0;">24 hours</strong>. For urgent requirements, feel free to WhatsApp us directly.
            </p>
            <div style="background:rgba(245,166,35,0.06);border:1px solid rgba(245,166,35,0.2);border-radius:12px;padding:24px;margin-bottom:28px;">
              <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Contact Us Directly</div>
              <div style="color:#f0f0f8;font-size:14px;line-height:2;">
                📞 <a href="tel:+919876543210" style="color:#f5a623;text-decoration:none;">+91 98765 43210</a><br/>
                💬 <a href="https://wa.me/919876543210" style="color:#f5a623;text-decoration:none;">WhatsApp Chat</a><br/>
                📍 Near Mahamarga Bus Stand, Nashik
              </div>
            </div>
            <div style="text-align:center;">
              <a href="https://wa.me/919876543210?text=Hello%20Smart%20Art!%20I%20just%20submitted%20an%20enquiry." style="display:inline-block;background:linear-gradient(135deg,#f5a623,#c77c0a);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Contact Us on WhatsApp</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#0c0c18;border:1px solid rgba(245,166,35,0.25);border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">© Smart Art — Atik Shaikh · Nashik, Maharashtra</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Send admin notification ───────────────────────────────────────────
const sendEnquiryNotification = async (contactData, adminEmail) => {
  const t = getTransporter();
  if (!t) return { sent: false, reason: 'SMTP not configured' };

  const notifyTo = adminEmail || process.env.ADMIN_NOTIFY_EMAIL;
  if (!notifyTo) return { sent: false, reason: 'No admin email set' };

  try {
    await t.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Smart Art Website'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: notifyTo,
      subject: `🔔 New Enquiry from ${contactData.name}${contactData.business_name ? ` (${contactData.business_name})` : ''} — Smart Art`,
      html: enquiryEmailHTML(contactData),
    });
    console.log(`✅ Enquiry notification sent to ${notifyTo}`);
    return { sent: true };
  } catch (err) {
    console.error('❌ Failed to send enquiry notification:', err.message);
    return { sent: false, reason: err.message };
  }
};

// ── Send auto-reply to client ─────────────────────────────────────────
const sendAutoReply = async ({ name, email, service_type }) => {
  if (!email) return { sent: false, reason: 'No client email' };
  const t = getTransporter();
  if (!t) return { sent: false, reason: 'SMTP not configured' };

  try {
    await t.sendMail({
      from: `"Smart Art – Nashik" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: `✅ We received your enquiry, ${name}! — Smart Art Nashik`,
      html: autoReplyHTML({ name, service_type }),
    });
    console.log(`✅ Auto-reply sent to ${email}`);
    return { sent: true };
  } catch (err) {
    console.error('❌ Failed to send auto-reply:', err.message);
    return { sent: false, reason: err.message };
  }
};

// ── Verify SMTP connection ────────────────────────────────────────────
const verifyConnection = async () => {
  const t = getTransporter();
  if (!t) return { ok: false, reason: 'SMTP not configured' };
  try {
    await t.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
};

module.exports = { sendEnquiryNotification, sendAutoReply, verifyConnection };
