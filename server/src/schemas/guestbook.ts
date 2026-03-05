import { z } from 'zod';

const MAX_BASE64_SIZE = 2 * 1024 * 1024 * 1.37; // ~2MB file ≈ 2.74MB base64

export const createGuestbookEntrySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  photo: z
    .string()
    .max(MAX_BASE64_SIZE, 'Photo exceeds 2MB limit')
    .refine((v) => v.startsWith('data:image/'), 'Photo must be a data URI')
    .optional(),
  audioClip: z
    .string()
    .max(MAX_BASE64_SIZE, 'Audio exceeds 2MB limit')
    .refine((v) => v.startsWith('data:audio/') || v.startsWith('data:video/webm'), 'Audio must be a data URI')
    .optional(),
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
