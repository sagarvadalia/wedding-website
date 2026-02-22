import { z } from 'zod';

export const mongoIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format'),
});

const mailingAddressSchema = z
  .object({
    addressLine1: z.string().trim().max(200).optional(),
    addressLine2: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100).optional(),
    stateOrProvince: z.string().trim().max(100).optional(),
    postalCode: z.string().trim().max(20).optional(),
    country: z.string().trim().max(100).optional(),
  })
  .nullable()
  .optional();

export const addGuestSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(254).optional(),
  groupId: z.string().min(1, 'Group ID is required'),
  allowedPlusOne: z.boolean().optional(),
  hasBooked: z.boolean().optional(),
  mailingAddress: mailingAddressSchema,
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
  mailingAddress: mailingAddressSchema,
});

export const createGroupSchema = z.object({
  name: z.string().trim().max(200).optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().trim().max(200).optional(),
});

const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

export const sendReminderSchema = z.object({
  guestIds: z.array(mongoIdSchema).min(1, 'At least one guest ID is required').max(500),
});

export type AddGuestBody = z.infer<typeof addGuestSchema>;
export type UpdateGuestBody = z.infer<typeof updateGuestSchema>;
export type CreateGroupBody = z.infer<typeof createGroupSchema>;
export type UpdateGroupBody = z.infer<typeof updateGroupSchema>;
export type SendReminderBody = z.infer<typeof sendReminderSchema>;
