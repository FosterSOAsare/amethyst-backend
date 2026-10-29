import { Schema, model } from "mongoose";

// One document per named sequence, e.g. { _id: "eventId", seq: 7 }.
const counterSchema = new Schema<{ _id: string; seq: number }>({
  _id: { type: String, required: true },
  seq: { type: Number, required: true },
});

const CounterModel = model("Counter", counterSchema);

/**
 * Returns the next number in a named sequence.
 * MongoDB applies `$inc` atomically, so two requests running at the same
 * moment can never receive the same number.
 *
 * `findCurrentMax` is only called the very first time, so the sequence
 * starts after any numbers that already exist.
 */
export async function nextSequenceValue(
  name: string,
  findCurrentMax: () => Promise<number>,
): Promise<number> {
  const exists = await CounterModel.exists({ _id: name });
  if (!exists) {
    await startSequence(name, await findCurrentMax());
  }

  const counter = await CounterModel.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true },
  );
  return counter!.seq;
}

async function startSequence(name: string, startAt: number) {
  try {
    // $setOnInsert only writes when the counter does not exist yet.
    await CounterModel.updateOne(
      { _id: name },
      { $setOnInsert: { seq: startAt } },
      { upsert: true },
    );
  } catch (error: any) {
    // Two first-ever requests can race to create the counter. The loser gets
    // a duplicate-key error (code 11000), which is fine: the counter exists.
    if (error?.code !== 11000) throw error;
  }
}
