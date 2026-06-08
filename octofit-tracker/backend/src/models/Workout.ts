import { InferSchemaType, Schema, model, models } from "mongoose";

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["strength", "cardio", "mobility", "hiit", "recovery"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    targetMuscleGroups: [{ type: String, required: true }],
    suggestedForLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
  },
  { timestamps: true }
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;
export const Workout = models.Workout || model("Workout", workoutSchema);
