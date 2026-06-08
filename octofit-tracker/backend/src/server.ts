/// <reference path="./types/shims.d.ts" />

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import type { Request, Response } from "express";
import { Activity } from "./models/Activity";
import { connectDatabase } from "./config/database";
import { Leaderboard } from "./models/Leaderboard";
import { Team } from "./models/Team";
import { User } from "./models/User";
import { Workout } from "./models/Workout";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "octofit-backend", baseUrl });
});

app.get("/api/users/", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().populate("team", "name city").lean();
    res.json({ count: users.length, data: users, resource: "users" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/teams/", async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate("members", "name email").lean();
    res.json({ count: teams.length, data: teams, resource: "teams" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

app.get("/api/activities/", async (_req: Request, res: Response) => {
  try {
    const activities = await Activity.find()
      .sort({ date: -1 })
      .populate("user", "name fitnessLevel")
      .lean();
    res.json({ count: activities.length, data: activities, resource: "activities" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.get("/api/leaderboard/", async (_req: Request, res: Response) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ rank: 1 })
      .populate("user", "name team")
      .lean();
    res.json({ count: leaderboard.length, data: leaderboard, resource: "leaderboard" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

app.get("/api/workouts/", async (_req: Request, res: Response) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 }).lean();
    res.json({ count: workouts.length, data: workouts, resource: "workouts" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit backend listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

void startServer();
