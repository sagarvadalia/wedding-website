import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Guest from '../models/Guest.js';
import Group from '../models/Group.js';
import { loggers } from '../utils/logger.js';

const log = loggers.app;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Event metadata for day-by-day itinerary (must match client RsvpPage eventOptions). */
const EVENT_META: Record<string, { dayOfWeek: string; date: string; time: string; name: string }> = {
  welcome: { dayOfWeek: 'Friday', date: 'April 2, 2027', time: '6:00 PM', name: 'Welcome Dinner' },
  haldi: { dayOfWeek: 'Saturday', date: 'April 3, 2027', time: '10:00 AM', name: 'Haldi Ceremony' },
  mehndi: { dayOfWeek: 'Saturday', date: 'April 3, 2027', time: '2:00 PM', name: 'Mehndi Ceremony' },
  baraat: { dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '4:00 PM', name: 'Baraat Procession' },
  wedding: { dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '5:30 PM', name: 'Wedding Ceremony' },
  cocktail: { dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '6:30 PM', name: 'Cocktail Hour' },
  reception: { dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '7:30 PM', name: 'Reception Dinner' }
};

const GMAIL_USER = process.env.GMAIL_USER ?? '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD ?? '';
const WEDDING_NAME = process.env.WEDDING_NAME ?? 'Sagar & Grace';
const CONFIRMATION_EMAIL_ENABLED = process.env.CONFIRMATION_EMAIL_ENABLED !== 'false';
/** Base URL for email images (hosted); use CLIENT_URL so production emails show site assets. */
const EMAIL_IMAGES_BASE_URL = (process.env.CLIENT_URL ?? '').replace(/\/$/, '');
const RSVP_URL = EMAIL_IMAGES_BASE_URL ? `${EMAIL_IMAGES_BASE_URL}/rsvp` : '#';
const TRAVEL_BOOKING_URL = (process.env.TRAVEL_BOOKING_URL ?? 'https://www.indiandestinationwedding.com/grace-sagar/').replace(/\/$/, '') || '#';

interface GuestForEmail {
  firstName: string;
  lastName: string;
  rsvpStatus: string;
  events: string[];
  dietaryRestrictions?: string;
  plusOne?: { name: string } | null;
  songRequest?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function statusLabel(status: string): string {
  switch (status) {
    case 'confirmed': return 'Attending';
    case 'maybe': return 'Maybe';
    case 'declined': return 'Not attending';
    default: return 'Pending';
  }
}

const DAY_ORDER = ['Friday, April 2, 2027', 'Saturday, April 3, 2027', 'Sunday, April 4, 2027'];

/** Group a guest's event ids by date for day-by-day display (chronological order). */
function groupEventsByDate(eventIds: string[]): { dateLabel: string; events: { name: string; time: string }[] }[] {
  const byDate = new Map<string, { name: string; time: string }[]>();
  for (const id of eventIds) {
    const meta = EVENT_META[id];
    if (!meta) continue;
    const key = `${meta.dayOfWeek}, ${meta.date}`;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push({ name: meta.name, time: meta.time });
  }
  const entries = Array.from(byDate.entries()).map(([dateLabel, events]) => ({ dateLabel, events }));
  entries.sort((a, b) => DAY_ORDER.indexOf(a.dateLabel) - DAY_ORDER.indexOf(b.dateLabel));
  return entries;
}

function buildConfirmationText(
  groupName: string | undefined,
  guests: GuestForEmail[]
): string {
  const lines: string[] = [
    `Thank you for your RSVP! We're so excited to celebrate with you.`,
    '',
    'Here is a summary of your response:',
    ''
  ];

  for (const g of guests) {
    const name = `${g.firstName} ${g.lastName}`;
    lines.push(`${name}: ${statusLabel(g.rsvpStatus)}`);
    if (g.rsvpStatus === 'confirmed' || g.rsvpStatus === 'maybe') {
      if (g.events?.length) {
        const byDay = groupEventsByDate(g.events);
        for (const day of byDay) {
          lines.push(`  ${day.dateLabel}`);
          for (const ev of day.events) {
            lines.push(`    · ${ev.name} — ${ev.time}`);
          }
        }
      }
      if (g.dietaryRestrictions?.trim()) {
        lines.push(`  Dietary: ${g.dietaryRestrictions.trim()}`);
      }
      if (g.plusOne?.name?.trim()) {
        lines.push(`  Plus one: ${g.plusOne.name.trim()}`);
      }
      if (g.songRequest?.trim()) {
        lines.push(`  Song request: ${g.songRequest.trim()}`);
      }
    }
    lines.push('');
  }

  lines.push(`We look forward to seeing you at ${WEDDING_NAME}'s wedding!`);
  return lines.join('\n');
}

/** Ocean theme colors (inline CSS for email). */
const OCEAN_DEEP = '#1E3A5F';
const OCEAN_CARIBBEAN = '#2E8B8B';
const SAND_PEARL = '#FAF8F5';
const SAND_DARK = '#8B7355';
const SAND_DRIFTWOOD = '#C4A77D';
const GOLD = '#D4AF37';

function buildConfirmationHtml(
  groupName: string | undefined,
  guests: GuestForEmail[],
  weddingName: string,
  bannerCid: string | null
): string {
  const safeName = escapeHtml(weddingName);
  const bannerUrl = !bannerCid && EMAIL_IMAGES_BASE_URL ? `${EMAIL_IMAGES_BASE_URL}/images/email-image.jpg` : '';
  const siteUrl = EMAIL_IMAGES_BASE_URL || '#';
  const bannerImg = bannerCid
    ? `<img src="cid:${bannerCid}" alt="Destination wedding" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />`
    : bannerUrl
      ? `<img src="${bannerUrl}" alt="Destination wedding" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />`
      : '';

  const guestBlocks = guests.map((g) => {
    const name = escapeHtml(`${g.firstName} ${g.lastName}`);
    const status = escapeHtml(statusLabel(g.rsvpStatus));
    const isAttending = g.rsvpStatus === 'confirmed' || g.rsvpStatus === 'maybe';

    let itineraryHtml = '';
    if (isAttending && g.events?.length) {
      const byDay = groupEventsByDate(g.events);
      const dayRows = byDay.map((day) => {
        const eventRows = day.events.map((ev) => `<tr><td style="padding:6px 0 6px 16px;font-size:14px;color:${SAND_DARK};border:none;">${escapeHtml(ev.name)}</td><td style="padding:6px 0;font-size:14px;color:${SAND_DARK};border:none;white-space:nowrap;">${escapeHtml(ev.time)}</td></tr>`).join('');
        return `<tr><td colspan="2" style="padding:10px 0 4px 0;font-size:14px;font-weight:600;color:${OCEAN_DEEP};border:none;">${escapeHtml(day.dateLabel)}</td></tr>${eventRows}`;
      }).join('');
      itineraryHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;"><tbody>${dayRows}</tbody></table>`;
    }

    const dietary = g.dietaryRestrictions?.trim() ? escapeHtml(g.dietaryRestrictions.trim()) : '';
    const plusOne = g.plusOne?.name?.trim() ? escapeHtml(g.plusOne.name.trim()) : '';
    const song = g.songRequest?.trim() ? escapeHtml(g.songRequest.trim()) : '';
    const extraRows: string[] = [];
    if (dietary) extraRows.push(`<tr><td style="padding:6px 0;font-size:14px;color:${SAND_DARK};"><strong>Dietary:</strong> ${dietary}</td></tr>`);
    if (plusOne) extraRows.push(`<tr><td style="padding:6px 0;font-size:14px;color:${SAND_DARK};"><strong>Plus one:</strong> ${plusOne}</td></tr>`);
    if (song) extraRows.push(`<tr><td style="padding:6px 0;font-size:14px;color:${SAND_DARK};"><strong>Song request:</strong> ${song}</td></tr>`);
    const extraHtml = isAttending && extraRows.length > 0
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;padding-top:12px;border-top:1px solid ${SAND_DRIFTWOOD};"><tbody>${extraRows.join('')}</tbody></table>`
      : '';

    return `
    <tr><td style="padding:20px 20px 16px 20px;background:white;border:1px solid ${SAND_DRIFTWOOD};border-bottom:none;border-radius:8px 8px 0 0;">
      <strong style="font-size:16px;color:${OCEAN_DEEP};">${name}</strong>
      <span style="color:${SAND_DRIFTWOOD};margin-left:8px;">·</span>
      <span style="font-size:15px;color:${OCEAN_CARIBBEAN};">${status}</span>
    </td></tr>
    <tr><td style="padding:0 20px 20px 20px;background:white;border:1px solid ${SAND_DRIFTWOOD};border-top:none;border-radius:0 0 8px 8px;">
      ${itineraryHtml ? `<p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:${OCEAN_DEEP};text-transform:uppercase;letter-spacing:0.5px;">Your itinerary</p>${itineraryHtml}` : ''}
      ${extraHtml}
    </td></tr>`;
  }).join('<tr><td style="height:12px;"></td></tr>');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${SAND_PEARL};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${SAND_PEARL};">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr>
          <td style="background:${OCEAN_DEEP};color:${SAND_PEARL};padding:28px 24px;text-align:center;">
            <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:600;letter-spacing:0.5px;">We've received your RSVP</h1>
            <p style="margin:0;font-size:16px;opacity:0.95;">${safeName}</p>
          </td>
        </tr>
        ${bannerImg ? `<tr><td style="padding:0;">${bannerImg}</td></tr>` : ''}
        <tr>
          <td style="padding:28px 24px;">
            <p style="margin:0 0 16px 0;font-size:17px;color:${SAND_DARK};line-height:1.6;">Thank you for your RSVP! We're so excited to celebrate with you.</p>
            <p style="margin:0 0 12px 0;font-size:15px;color:${OCEAN_DEEP};font-weight:600;">Here is a summary of your response:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
              ${guestBlocks}
            </table>
            <p style="margin:24px 0 0 0;font-size:16px;color:${SAND_DARK};line-height:1.6;">We look forward to seeing you at our wedding!!</p>
          </td>
        </tr>
        <tr>
          <td style="background:${OCEAN_DEEP};color:${SAND_PEARL};padding:20px 24px;text-align:center;">
            <p style="margin:0;font-size:14px;opacity:0.9;">See you at the ocean</p>
            ${siteUrl !== '#' ? `<p style="margin:8px 0 0 0;font-size:13px;"><a href="${siteUrl}" style="color:${GOLD};text-decoration:none;">Visit our wedding site</a></p>` : ''}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Send RSVP confirmation email to the first guest in the group via Gmail SMTP.
 * Fire-and-forget: call without await and catch errors in the caller.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD (Google App Password with 2FA enabled).
 */
export async function sendRsvpConfirmation(groupId: string): Promise<void> {
  if (!CONFIRMATION_EMAIL_ENABLED || !GMAIL_USER.trim() || !GMAIL_APP_PASSWORD.trim()) {
    log.info(
      { confirmationEmailEnabled: CONFIRMATION_EMAIL_ENABLED, gmailUserSet: Boolean(GMAIL_USER.trim()), gmailAppPasswordSet: Boolean(GMAIL_APP_PASSWORD.trim()) },
      'Confirmation email skipped (disabled or missing Gmail credentials)'
    );
    return;
  }

  try {
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    const [group, guests] = await Promise.all([
      Group.findById(groupObjectId).lean(),
      Guest.find({ groupId: groupObjectId }).sort({ createdAt: 1 }).lean()
    ]);

    if (!group || guests.length === 0) {
      log.warn({ groupId }, 'Group or guests not found for confirmation email');
      return;
    }

    const firstGuest = guests[0] as { email?: string; firstName: string; lastName: string; rsvpStatus: string; events: string[]; dietaryRestrictions?: string; plusOne?: { name: string } | null; songRequest?: string };
    const to = firstGuest.email?.trim();
    if (!to) {
      log.warn({ groupId }, 'No email for first guest, skipping confirmation');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER.trim(),
        pass: GMAIL_APP_PASSWORD
      }
    });

    const subject = `We've received your RSVP – ${WEDDING_NAME}`;
    const guestList = guests as GuestForEmail[];
    const groupName = (group as { name?: string }).name;
    const text = buildConfirmationText(groupName, guestList);

    const bannerPath = path.join(__dirname, '..', '..', 'public', 'images', 'email-image.jpg');
    let bannerCid: string | null = null;
    const attachments: nodemailer.SendMailOptions['attachments'] = [];
    try {
      const bannerBuffer = fs.readFileSync(bannerPath);
      attachments.push({ filename: 'banner.jpg', content: bannerBuffer, cid: 'banner' });
      bannerCid = 'banner';
    } catch {
      log.debug({ bannerPath }, 'Banner image not found; email will use hosted URL or no image');
    }
    const html = buildConfirmationHtml(groupName, guestList, WEDDING_NAME, bannerCid);

    const info = await transporter.sendMail({
      from: `"${WEDDING_NAME} Wedding" <${GMAIL_USER.trim()}>`,
      to,
      subject,
      text,
      html,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    log.info({ messageId: info.messageId, groupId, to }, 'RSVP confirmation email sent via Gmail');
  } catch (err) {
    log.error({ err, groupId }, 'Error sending RSVP confirmation email');
  }
}

export interface ReminderResult {
  sent: number;
  skipped: number;
  errors: { guestId: string; name: string; email: string; reason: string }[];
}

function buildReminderHtml(
  _firstName: string,
  headline: string,
  bodyParagraphs: string[],
  ctaLabel: string,
  ctaUrl: string,
  bannerCid: string | null
): string {
  const siteUrl = EMAIL_IMAGES_BASE_URL || '#';
  const bannerUrl = !bannerCid && EMAIL_IMAGES_BASE_URL ? `${EMAIL_IMAGES_BASE_URL}/images/email-image.jpg` : '';
  const bannerImg = bannerCid
    ? `<img src="cid:${bannerCid}" alt="Destination wedding" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />`
    : bannerUrl
      ? `<img src="${bannerUrl}" alt="Destination wedding" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />`
      : '';
  const body = bodyParagraphs.map((p) => `<p style="margin:0 0 16px 0;font-size:17px;color:${SAND_DARK};line-height:1.6;">${escapeHtml(p)}</p>`).join('');
  const ctaHtml = ctaUrl !== '#'
    ? `<p style="margin:20px 0 0 0;"><a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:${OCEAN_CARIBBEAN};color:${SAND_PEARL};padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">${escapeHtml(ctaLabel)}</a></p>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${SAND_PEARL};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${SAND_PEARL};">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr>
          <td style="background:${OCEAN_DEEP};color:${SAND_PEARL};padding:28px 24px;text-align:center;">
            <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:600;letter-spacing:0.5px;">${escapeHtml(headline)}</h1>
            <p style="margin:0;font-size:16px;opacity:0.95;">${WEDDING_NAME}</p>
          </td>
        </tr>
        ${bannerImg ? `<tr><td style="padding:0;">${bannerImg}</td></tr>` : ''}
        <tr>
          <td style="padding:28px 24px;">
            ${body}
            ${ctaHtml}
          </td>
        </tr>
        <tr>
          <td style="background:${OCEAN_DEEP};color:${SAND_PEARL};padding:20px 24px;text-align:center;">
            <p style="margin:0;font-size:14px;opacity:0.9;">See you at the ocean</p>
            ${siteUrl !== '#' ? `<p style="margin:8px 0 0 0;font-size:13px;"><a href="${siteUrl}" style="color:${GOLD};text-decoration:none;">Visit our wedding site</a></p>` : ''}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function loadBannerAttachment(): { cid: string | null; attachments: nodemailer.SendMailOptions['attachments'] } {
  const bannerPath = path.join(__dirname, '..', '..', 'public', 'images', 'email-image.jpg');
  try {
    const bannerBuffer = fs.readFileSync(bannerPath);
    return {
      cid: 'banner',
      attachments: [{ filename: 'banner.jpg', content: bannerBuffer, cid: 'banner' }]
    };
  } catch {
    log.debug({ bannerPath }, 'Banner image not found; reminder email will use hosted URL or no image');
    return { cid: null, attachments: [] };
  }
}

/**
 * Send RSVP reminder emails to selected guests (Option A content).
 * Updates lastRsvpReminderAt on successful send. Returns per-guest results and errors.
 */
export async function sendRsvpReminder(guestIds: string[]): Promise<ReminderResult> {
  const result: ReminderResult = { sent: 0, skipped: 0, errors: [] };

  if (!GMAIL_USER.trim() || !GMAIL_APP_PASSWORD.trim()) {
    result.errors.push({ guestId: '', name: '', email: '', reason: 'Email not configured: missing GMAIL_USER or GMAIL_APP_PASSWORD' });
    return result;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER.trim(), pass: GMAIL_APP_PASSWORD }
  });

  const { cid: bannerCid, attachments } = loadBannerAttachment();

  for (const id of guestIds) {
    let guest: { _id: mongoose.Types.ObjectId; firstName: string; lastName: string; email?: string } | null = null;
    try {
      guest = await Guest.findById(id).lean();
    } catch {
      result.errors.push({ guestId: id, name: '', email: '', reason: 'Invalid guest ID' });
      continue;
    }
    if (!guest) {
      result.errors.push({ guestId: id, name: '', email: '', reason: 'Guest not found' });
      continue;
    }
    const email = guest.email?.trim();
    const name = `${guest.firstName} ${guest.lastName}`;
    if (!email) {
      result.skipped++;
      result.errors.push({ guestId: id, name, email: '', reason: 'No email address' });
      continue;
    }

    const text = `Hey ${guest.firstName},\n\nWe're so excited to celebrate our wedding with you! A quick reminder to RSVP if you haven't already — we'd love to know if you can make it.\n\nRSVP here: ${RSVP_URL}\n\nAnd don't forget: this is a destination wedding, so start thinking about travel. We can't wait to see you there!`;
    const html = buildReminderHtml(
      guest.firstName,
      "We'd love to have you!",
      [
        `Hey ${guest.firstName},`,
        "We're so excited to celebrate our wedding with you! A quick reminder to RSVP if you haven't already — we'd love to know if you can make it.",
        "And don't forget: this is a destination wedding, so start thinking about travel. We can't wait to see you there!"
      ],
      'RSVP here',
      RSVP_URL,
      bannerCid
    );

    try {
      await transporter.sendMail({
        from: `"${WEDDING_NAME} Wedding" <${GMAIL_USER.trim()}>`,
        to: email,
        subject: `Don't forget to RSVP – ${WEDDING_NAME}`,
        text,
        html,
        attachments: (attachments ?? []).length > 0 ? attachments : undefined
      });
      await Guest.findByIdAndUpdate(id, { lastRsvpReminderAt: new Date() });
      result.sent++;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      result.errors.push({ guestId: id, name, email, reason: `Send failed: ${errMsg}` });
    }
  }

  return result;
}

/**
 * Send travel reminder emails to selected guests (Option A content).
 * Updates lastTravelReminderAt on successful send. Returns per-guest results and errors.
 */
export async function sendTravelReminder(guestIds: string[]): Promise<ReminderResult> {
  const result: ReminderResult = { sent: 0, skipped: 0, errors: [] };

  if (!GMAIL_USER.trim() || !GMAIL_APP_PASSWORD.trim()) {
    result.errors.push({ guestId: '', name: '', email: '', reason: 'Email not configured: missing GMAIL_USER or GMAIL_APP_PASSWORD' });
    return result;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER.trim(), pass: GMAIL_APP_PASSWORD }
  });

  const { cid: bannerCid, attachments } = loadBannerAttachment();

  for (const id of guestIds) {
    let guest: { _id: mongoose.Types.ObjectId; firstName: string; lastName: string; email?: string } | null = null;
    try {
      guest = await Guest.findById(id).lean();
    } catch {
      result.errors.push({ guestId: id, name: '', email: '', reason: 'Invalid guest ID' });
      continue;
    }
    if (!guest) {
      result.errors.push({ guestId: id, name: '', email: '', reason: 'Guest not found' });
      continue;
    }
    const email = guest.email?.trim();
    const name = `${guest.firstName} ${guest.lastName}`;
    if (!email) {
      result.skipped++;
      result.errors.push({ guestId: id, name, email: '', reason: 'No email address' });
      continue;
    }

    const text = `Hey ${guest.firstName},\n\nThank you for RSVPing! We're thrilled you're coming.\n\nA friendly reminder: please book your hotel and travel soon. Use our group link to reserve your room:\n\n${TRAVEL_BOOKING_URL}\n\nCan't wait to celebrate with you!`;
    const html = buildReminderHtml(
      guest.firstName,
      'Time to book your travel!',
      [
        `Hey ${guest.firstName},`,
        "Thank you for RSVPing! We're thrilled you're coming.",
        "A friendly reminder: please book your hotel and travel soon. Use our group link to reserve your room."
      ],
      'Book your travel',
      TRAVEL_BOOKING_URL,
      bannerCid
    );

    try {
      await transporter.sendMail({
        from: `"${WEDDING_NAME} Wedding" <${GMAIL_USER.trim()}>`,
        to: email,
        subject: `Book your travel – ${WEDDING_NAME}`,
        text,
        html,
        attachments: (attachments ?? []).length > 0 ? attachments : undefined
      });
      await Guest.findByIdAndUpdate(id, { lastTravelReminderAt: new Date() });
      result.sent++;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      result.errors.push({ guestId: id, name, email, reason: `Send failed: ${errMsg}` });
    }
  }

  return result;
}
