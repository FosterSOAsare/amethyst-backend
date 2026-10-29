import { z } from "zod";

export type BookingStatus =
  | "COMPLETED"
  | "CONFIRMED"
  | "PENDING"
  | "CANCELLED"
  | "PROCESSED";

export type BookingType = "room" | "dining";

export const createBookingSchema = z.object({
  type: z.enum(["room", "dining"], { message: "Type must be room or dining" }),
  itemType: z.string().min(1, "Item type is required"), // Room Type ID or Dining Area ID
  item: z.string().min(1, "Item is required"), // Room Instance ID or Table ID
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  guests: z.coerce
    .number({ message: "Guests must be a number" })
    .int("Guests must be a whole number")
    .min(1, "Guests must be at least 1"),
  amount: z.number().optional(), // calculated/passed from front-end
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
