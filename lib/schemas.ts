/**
 * Zod validation schemas for all CMS content types.
 * Used client-side for form validation before hitting the API.
 * Zod v4 compatible.
 */
import { z } from 'zod';

// ── Helpers ───────────────────────────────────────────────────────────────
const nonEmpty = (label: string) =>
  z.string().min(1, `${label} is required`).max(2000);

const urlOrEmpty = z
  .string()
  .max(2048)
  .refine(v => v === '' || v.startsWith('http') || v.startsWith('/'), {
    message: 'Must be a valid URL or relative path',
  });

// ── News ──────────────────────────────────────────────────────────────────
export const NewsSchema = z.object({
  title:     nonEmpty('Article title').max(200, 'Title must be under 200 characters'),
  slug:      z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  date:      z.string().min(1, 'Date is required'),
  excerpt:   z.string().max(300, 'Excerpt must be under 300 characters').default(''),
  content:   z.string().min(10, 'Article body must have at least 10 characters'),
  imageUrl:  urlOrEmpty.default(''),
  published: z.boolean().default(true),
});
export type NewsFormData = z.infer<typeof NewsSchema>;

// ── Events ────────────────────────────────────────────────────────────────
export const EventSchema = z.object({
  title:       nonEmpty('Event title').max(200),
  type:        z.enum(['webinar', 'fair', 'deadline', 'workshop', 'seminar']),
  date:        z.string().min(1, 'Date is required'),
  time:        z.string().default(''),
  location:    z.string().max(200).default(''),
  description: z.string().max(500, 'Description must be under 500 characters').default(''),
  body:        z.string().default(''),
  country:     z.string().default(''),
  imageUrl:    urlOrEmpty.default(''),
  ctaLabel:    z.string().default('Register Free'),
  ctaUrl:      urlOrEmpty.default('/contact'),
  seats:       z.number().int().positive().optional(),
  speakers:    z.array(z.string()).default([]),
  published:   z.boolean().default(true),
});
export type EventFormData = z.infer<typeof EventSchema>;

// ── Testimonial ───────────────────────────────────────────────────────────
export const TestimonialSchema = z.object({
  name:      nonEmpty('Student name').max(100),
  role:      z.string().max(150).default(''),
  uni:       z.string().max(200).default(''),
  country:   z.string().max(100).default(''),
  quote:     nonEmpty('Testimonial quote').max(600, 'Quote must be under 600 characters'),
  imageUrl:  urlOrEmpty.default(''),
  stars:     z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(true),
});
export type TestimonialFormData = z.infer<typeof TestimonialSchema>;

// ── Page ──────────────────────────────────────────────────────────────────
export const PageSchema = z.object({
  title:           nonEmpty('Page title').max(200),
  slug:            z.string().min(1, 'Slug is required'),
  metaTitle:       z.string().max(200).default(''),
  metaDescription: z.string().max(300).default(''),
  category:        z.string().max(100).default(''),
  description:     z.string().max(500).default(''),
  body:            z.string().default(''),
  heroImageUrl:    urlOrEmpty.default(''),
  layout:          z.enum(['default', 'article', 'landing', 'country']).default('default'),
  published:       z.boolean().default(false),
});
export type PageFormData = z.infer<typeof PageSchema>;

// ── Audit log entry ───────────────────────────────────────────────────────
export interface AuditEntry {
  id:         string;
  timestamp:  string;       // ISO
  action:     string;       // e.g. "Published News Article"
  entity:     string;       // e.g. "news", "event", "testimonial"
  entityId:   string;       // ID of the changed item
  entityName: string;       // Human label e.g. article title
  before:     unknown;      // Previous snapshot (null if new)
  after:      unknown;      // New snapshot
  published:  boolean;      // Whether the save was a publish or draft
}
