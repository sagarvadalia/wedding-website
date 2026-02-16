import { z } from 'zod';

export const mongoIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format'),
});

export const addGuestSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(254),
  groupId: z.string().min(1, 'Group ID is required'),
  allowedPlusOne: z.boolean().optional(),
  hasBooked: z.boolean().optional(),
});

export const updateGuestSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email('Invalid email address').max(254).optional(),
  groupId: z.union([
    z.string().min(1),
    z.object({ _id: z.string() }),
  ]).optional(),
  allowedPlusOne: z.boolean().optional(),
  hasBooked: z.boolean().optional(),
});

export const createGroupSchema = z.object({
  name: z.string().trim().max(200).optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().trim().max(200).optional(),
});

export type AddGuestBody = z.infer<typeof addGuestSchema>;
export type UpdateGuestBody = z.infer<typeof updateGuestSchema>;
export type CreateGroupBody = z.infer<typeof createGroupSchema>;
export type UpdateGroupBody = z.infer<typeof updateGroupSchema>;
