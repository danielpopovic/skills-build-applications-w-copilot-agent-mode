import { InferSchemaType, Schema, model, models } from "mongoose";

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["run", "cycle", "swim", "strength", "yoga", "walk"],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;
export const Activity = models.Activity || model("Activity", activitySchema);
