import { Request, Response } from 'express';
import mongoose from 'mongoose';
import GuestbookEntry from '../models/GuestbookEntry.js';
import { loggers } from '../utils/logger.js';

const log = loggers.app;

const DEFAULT_LIMIT = 20;

/**
 * List entries with metadata only (no media blobs).
 * The hasPhoto / hasAudioClip booleans let the client
 * build media URLs without ever receiving base64 inline.
 */
export const listEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, 50);

    const filter: Record<string, unknown> = {};
    if (cursor && mongoose.isValidObjectId(cursor)) {
      filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const entries = await GuestbookEntry.find(filter)
      .select('-photo -audioClip')
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = entries.length > limit;
    const page = hasMore ? entries.slice(0, limit) : entries;
    const lastEntry = page[page.length - 1];
    const nextCursor = hasMore && lastEntry ? String(lastEntry._id) : null;

    res.json({ entries: page, nextCursor });
  } catch (error) {
    log.error({ err: error }, 'List guestbook entries error');
    res.status(500).json({ error: 'Failed to list guestbook entries' });
  }
};

const ALLOWED_MEDIA_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/ogg',
  'audio/ogg;codecs=opus',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'video/webm',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp9,opus',
]);

function parseDataUri(dataUri: string): { contentType: string; buffer: Buffer } | null {
  const match = /^data:(.+?);base64,(.+)$/s.exec(dataUri);
  if (!match) return null;
  const contentType = match[1]!;
  if (!ALLOWED_MEDIA_TYPES.has(contentType)) return null;
  return { contentType, buffer: Buffer.from(match[2]!, 'base64') };
}

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export const getPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await GuestbookEntry.findById(req.params.id).select('photo').lean();
    if (!entry?.photo) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }
    const parsed = parseDataUri(entry.photo);
    if (!parsed) {
      res.status(500).json({ error: 'Corrupt photo data' });
      return;
    }
    res.set('Content-Type', parsed.contentType);
    res.set('Cache-Control', `public, max-age=${ONE_YEAR_SECONDS}, immutable`);
    res.send(parsed.buffer);
  } catch (error) {
    log.error({ err: error }, 'Get guestbook photo error');
    res.status(500).json({ error: 'Failed to retrieve photo' });
  }
};

export const getAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await GuestbookEntry.findById(req.params.id).select('audioClip').lean();
    if (!entry?.audioClip) {
      res.status(404).json({ error: 'Audio not found' });
      return;
    }
    const parsed = parseDataUri(entry.audioClip);
    if (!parsed) {
      res.status(500).json({ error: 'Corrupt audio data' });
      return;
    }
    res.set('Content-Type', parsed.contentType);
    res.set('Cache-Control', `public, max-age=${ONE_YEAR_SECONDS}, immutable`);
    res.send(parsed.buffer);
  } catch (error) {
    log.error({ err: error }, 'Get guestbook audio error');
    res.status(500).json({ error: 'Failed to retrieve audio' });
  }
};

export const createEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, message, photo, audioClip } = req.body as {
      name: string;
      message: string;
      photo?: string;
      audioClip?: string;
    };

    const entry = new GuestbookEntry({ name, message, photo, audioClip });
    await entry.save();

    res.status(201).json({
      success: true,
      entry: {
        _id: String(entry._id),
        name: entry.name,
        message: entry.message,
        hasPhoto: entry.hasPhoto,
        hasAudioClip: entry.hasAudioClip,
        createdAt: entry.createdAt,
      },
    });
  } catch (error) {
    log.error({ err: error }, 'Create guestbook entry error');
    res.status(500).json({ error: 'Failed to create guestbook entry' });
  }
};

export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const entry = await GuestbookEntry.findByIdAndDelete(id);
    if (!entry) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    log.error({ err: error }, 'Delete guestbook entry error');
    res.status(500).json({ error: 'Failed to delete guestbook entry' });
  }
};
