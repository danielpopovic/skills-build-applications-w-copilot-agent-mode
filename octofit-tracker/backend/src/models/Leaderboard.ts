import { InferSchemaType, Schema, model, models } from "mongoose";

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rank: { type: Number, required: true, min: 1 },
    score: { type: Number, required: true, min: 0 },
    weekOf: { type: Date, required: true },
  },
  { timestamps: true }
);

export type LeaderboardDocument = InferSchemaType<typeof leaderboardSchema>;
export const Leaderboard = models.Leaderboard || model("Leaderboard", leaderboardSchema);
