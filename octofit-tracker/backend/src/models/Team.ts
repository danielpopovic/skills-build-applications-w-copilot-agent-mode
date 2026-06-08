import { InferSchemaType, Schema, model, models } from "mongoose";

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;
export const Team = models.Team || model("Team", teamSchema);
