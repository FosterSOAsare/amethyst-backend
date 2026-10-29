import { Schema, model, type Document, type Model } from "mongoose";

export interface EventDocument extends Document {
  eventId: string; // EV_0001
  title: string;
  date: Date;
  time: string;
  location: string;
  desc: string;
  longDesc?: string;
  leadImage: string;
  detailsFile?: { url: string; name: string } | null; // optional PDF or Word document
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<EventDocument>(
  {
    eventId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    desc: { type: String, required: true },
    longDesc: { type: String },
    leadImage: { type: String, required: true },
    detailsFile: {
      type: { url: String, name: String },
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const EventModel: Model<EventDocument> = model<EventDocument>(
  "Event",
  eventSchema,
);
