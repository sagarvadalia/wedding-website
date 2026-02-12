import { Resend } from 'resend';
import mongoose from 'mongoose';
import Guest from '../models/Guest.js';
import Group from '../models/Group.js';
import { loggers } from '../utils/logger.js';

const log = loggers.app;

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'RSVP <onboarding@resend.dev>';
const WEDDING_NAME = process.env.WEDDING_NAME ?? 'Sagar & Grace';
const CONFIRMATION_EMAIL_ENABLED = process.env.CONFIRMATION_EMAIL_ENABLED !== 'false';

function statusLabel(status: string): string {
  switch (status) {
    case 'confirmed': return 'Attending';
    case 'maybe': return 'Maybe';
    case 'declined': return 'Not attending';
    default: return 'Pending';
  }
}

function buildConfirmationText(
  groupName: string | undefined,
  guests: { firstName: string; lastName: string; rsvpStatus: string; events: string[]; dietaryRestrictions?: string; plusOne?: { name: string } | null; songRequest?: string }[]
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
        lines.push(`  Events: ${g.events.join(', ')}`);
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

/**
 * Send RSVP confirmation email to the first guest in the group.
 * Fire-and-forget: call without await and catch errors in the caller.
 */
export async function sendRsvpConfirmation(groupId: string): Promise<void> {
  if (!CONFIRMATION_EMAIL_ENABLED || !RESEND_API_KEY.trim()) {
    log.debug('Confirmation email skipped (disabled or no API key)');
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

    const resend = new Resend(RESEND_API_KEY);
    const subject = `We've received your RSVP – ${WEDDING_NAME}`;
    const text = buildConfirmationText(
      (group as { name?: string }).name,
      guests as { firstName: string; lastName: string; rsvpStatus: string; events: string[]; dietaryRestrictions?: string; plusOne?: { name: string } | null; songRequest?: string }[]
    );

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      text
    });

    if (error) {
      log.error({ err: error, groupId, to }, 'Failed to send RSVP confirmation email');
      return;
    }
    log.info({ emailId: data?.id, groupId, to }, 'RSVP confirmation email sent');
  } catch (err) {
    log.error({ err, groupId }, 'Error sending RSVP confirmation email');
  }
}
