import { z } from 'zod';

const EVENT_TYPES = ['welcome', 'haldi', 'mehndi', 'baraat', 'wedding', 'cocktail', 'reception'] as const;

export const lookupQuerySchema = z.object({
  firstName: z
    .string({ required_error: 'firstName is required' })
    .trim()
    .min(1, 'firstName must not be empty')
    .max(100, 'firstName is too long'),
  lastName: z
    .string({ required_error: 'lastName is required' })
    .trim()
    .min(1, 'lastName must not be empty')
    .max(100, 'lastName is too long'),
});

const mailingAddressSchema = z
  .object({
    addressLine1: z.string().trim().max(200, 'Address line too long').optional(),
    addressLine2: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100, 'City too long').optional(),
    stateOrProvince: z.string().trim().max(100, 'State/province too long').optional(),
    postalCode: z.string().trim().max(20, 'Postal code too long').optional(),
    country: z.string().trim().max(100, 'Country too long').optional(),
  })
  .nullable()
  .optional();

const guestUpdateSchema = z.object({
  guestId: z.string().min(1, 'guestId is required'),
  attending: z.union([z.boolean(), z.literal('maybe')]),
  email: z.string().trim().email('Invalid email address').max(254).optional(),
  events: z.array(z.enum(EVENT_TYPES)).optional(),
  dietaryRestrictions: z.string().max(500, 'Dietary restrictions too long').optional(),
  plusOne: z
    .object({
      name: z.string().max(200, 'Plus-one name too long'),
      dietaryRestrictions: z.string().max(500).default(''),
    })
    .nullable()
    .optional(),
  songRequest: z.string().max(500, 'Song request too long').optional(),
  mailingAddress: mailingAddressSchema,
});

export const submitRsvpSchema = z.object({
  groupId: z.string().min(1, 'groupId is required'),
  guests: z
    .array(guestUpdateSchema)
    .min(1, 'At least one guest is required')
    .max(50, 'Too many guests'),
});

export type LookupQuery = z.infer<typeof lookupQuerySchema>;
export type SubmitRsvpBody = z.infer<typeof submitRsvpSchema>;
