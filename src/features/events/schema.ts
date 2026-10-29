import { z } from "zod";

export const eventTicketSchema = z.object({
  type: z.string().min(1, "Ticket type is required"),
  price: z.number().min(0, "Price must be positive"),
  totalQuantity: z.number().min(1).optional().nullable(), // Nullable for unlimited
});

// Event dates arrive as "YYYY-MM-DD", which JavaScript reads as midnight UTC.
// Comparing with midnight UTC today lets an event happen today, as the form allows.
function startOfToday(): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

const eventDateSchema = z.coerce
  .date({ message: "Please enter a valid date" })
  .refine((date) => date >= startOfToday(), {
    message: "Event date cannot be in the past",
  });

// The rules for each field, shared by create and update.
const eventFields = {
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: eventDateSchema,
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  desc: z.string().min(10, "Description must be at least 10 characters"),
  longDesc: z.string().optional(),
  leadImage: z.string().url("Valid image URL is required"),
  tickets: z.array(eventTicketSchema),
};

export const createEventSchema = z.object({
  ...eventFields,
  tickets: eventFields.tickets.optional().default([]),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Same rules as create, but every field is optional so an update can change just one.
// Tickets get no default here: leaving them out must keep the existing tickets.
export const updateEventSchema = z.object(eventFields).partial();

export const purchaseTicketSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  ticketId: z.string().min(1, "Ticket ID is required"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  quantity: z.number().int().min(1).optional(), // Add quantity to schema
});

export type PurchaseTicketInput = z.infer<typeof purchaseTicketSchema>;
