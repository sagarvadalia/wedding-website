import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UTApi } from 'uploadthing/server';
import GuestbookEntry from '../models/GuestbookEntry.js';
import { loggers } from '../utils/logger.js';

const log = loggers.app;
const utapi = new UTApi();
const DEFAULT_LIMIT = 20;

/**
 * List entries with metadata. Returns stored photoUrl/audioUrl from UploadThing.
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
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = entries.length > limit;
    const page = hasMore ? entries.slice(0, limit) : entries;
    const lastEntry = page[page.length - 1];
    const nextCursor = hasMore && lastEntry ? String(lastEntry._id) : null;

    const responseEntries = page.map((e) => ({
      _id: String(e._id),
      name: e.name,
      message: e.message,
      hasPhoto: e.hasPhoto,
      hasAudioClip: e.hasAudioClip,
      photoUrl: e.photoUrl ?? null,
      audioUrl: e.audioUrl ?? null,
      createdAt: e.createdAt,
    }));

    res.json({ entries: responseEntries, nextCursor });
  } catch (error) {
    log.error({ err: error }, 'List guestbook entries error');
    res.status(500).json({ error: 'Failed to list guestbook entries' });
  }
};

export const createEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, message, photoKey, audioClipKey, photoUrl, audioUrl } = req.body as {
      name: string;
      message: string;
      photoKey?: string;
      audioClipKey?: string;
      photoUrl?: string;
      audioUrl?: string;
    };

    const entry = new GuestbookEntry({
      name,
      message,
      photoKey,
      audioClipKey,
      photoUrl,
      audioUrl,
    });
    await entry.save();

    res.status(201).json({
      success: true,
      entry: {
        _id: String(entry._id),
        name: entry.name,
        message: entry.message,
        hasPhoto: entry.hasPhoto,
        hasAudioClip: entry.hasAudioClip,
        photoUrl: entry.photoUrl ?? null,
        audioUrl: entry.audioUrl ?? null,
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
    const entry = await GuestbookEntry.findById(id);
    if (!entry) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }

    const keys: string[] = [];
    if (entry.photoKey) keys.push(entry.photoKey);
    if (entry.audioClipKey) keys.push(entry.audioClipKey);

    for (const key of keys) {
      try {
        await utapi.deleteFiles(key);
      } catch (err) {
        log.warn({ err, key }, 'Failed to delete file from UploadThing');
        // Still proceed - other files may delete, entry will be removed
      }
    }

    await GuestbookEntry.findByIdAndDelete(id);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    log.error({ err: error }, 'Delete guestbook entry error');
    res.status(500).json({ error: 'Failed to delete entry' });
  }
};
