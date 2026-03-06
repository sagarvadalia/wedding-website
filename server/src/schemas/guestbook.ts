import { z } from 'zod';

export const createGuestbookEntrySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  photoKey: z.string().trim().min(1).optional(),
  audioClipKey: z.string().trim().min(1).optional(),
  photoUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
});

export const listGuestbookQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(50))
    .optional(),
});

export type CreateGuestbookEntryBody = z.infer<typeof createGuestbookEntrySchema>;
export type ListGuestbookQuery = z.infer<typeof listGuestbookQuerySchema>;
