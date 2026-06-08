import dotenv from "dotenv";
import mongoose from "mongoose";
import { Activity } from "../models/Activity";
import { Leaderboard } from "../models/Leaderboard";
import { Team } from "../models/Team";
import { User } from "../models/User";
import { Workout } from "../models/Workout";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/octofit_db";

async function seed() {
  await mongoose.connect(mongoUri);

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Leaderboard.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    {
      name: "Maya Thompson",
      email: "maya.thompson@example.com",
      age: 28,
      fitnessLevel: "intermediate",
      points: 980,
      totalWorkouts: 31,
    },
    {
      name: "Leo Martinez",
      email: "leo.martinez@example.com",
      age: 34,
      fitnessLevel: "advanced",
      points: 1210,
      totalWorkouts: 40,
    },
    {
      name: "Ava Nguyen",
      email: "ava.nguyen@example.com",
      age: 25,
      fitnessLevel: "beginner",
      points: 620,
      totalWorkouts: 18,
    },
    {
      name: "Noah Singh",
      email: "noah.singh@example.com",
      age: 31,
      fitnessLevel: "intermediate",
      points: 840,
      totalWorkouts: 27,
    },
  ]);

  const teams = await Team.insertMany([
    {
      name: "Harbor Hustlers",
      city: "Seattle",
      members: [users[0]._id, users[2]._id],
      totalPoints: users[0].points + users[2].points,
    },
    {
      name: "Summit Sprinters",
      city: "Denver",
      members: [users[1]._id, users[3]._id],
      totalPoints: users[1].points + users[3].points,
    },
  ]);

  await User.updateOne({ _id: users[0]._id }, { team: teams[0]._id });
  await User.updateOne({ _id: users[2]._id }, { team: teams[0]._id });
  await User.updateOne({ _id: users[1]._id }, { team: teams[1]._id });
  await User.updateOne({ _id: users[3]._id }, { team: teams[1]._id });

  const now = new Date();
  await Activity.insertMany([
    {
      user: users[0]._id,
      type: "run",
      durationMinutes: 42,
      caloriesBurned: 470,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    },
    {
      user: users[1]._id,
      type: "cycle",
      durationMinutes: 55,
      caloriesBurned: 620,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 48),
    },
    {
      user: users[2]._id,
      type: "yoga",
      durationMinutes: 35,
      caloriesBurned: 190,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 12),
    },
    {
      user: users[3]._id,
      type: "strength",
      durationMinutes: 50,
      caloriesBurned: 540,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 30),
    },
  ]);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  await Leaderboard.insertMany([
    { user: users[1]._id, rank: 1, score: 1210, weekOf: weekStart },
    { user: users[0]._id, rank: 2, score: 980, weekOf: weekStart },
    { user: users[3]._id, rank: 3, score: 840, weekOf: weekStart },
    { user: users[2]._id, rank: 4, score: 620, weekOf: weekStart },
  ]);

  await Workout.insertMany([
    {
      title: "Full Body Strength Circuit",
      category: "strength",
      difficulty: "intermediate",
      durationMinutes: 45,
      targetMuscleGroups: ["chest", "back", "legs", "core"],
      suggestedForLevel: "intermediate",
    },
    {
      title: "Beginner Cardio Burner",
      category: "cardio",
      difficulty: "beginner",
      durationMinutes: 30,
      targetMuscleGroups: ["legs", "core"],
      suggestedForLevel: "beginner",
    },
    {
      title: "Advanced HIIT Peak",
      category: "hiit",
      difficulty: "advanced",
      durationMinutes: 25,
      targetMuscleGroups: ["full body"],
      suggestedForLevel: "advanced",
    },
    {
      title: "Mobility Reset Flow",
      category: "mobility",
      difficulty: "beginner",
      durationMinutes: 20,
      targetMuscleGroups: ["hips", "shoulders", "hamstrings"],
      suggestedForLevel: "beginner",
    },
  ]);

  // Seed the octofit_db database with test data
  console.log("Seed the octofit_db database with test data");
  console.log("Users:", await User.countDocuments({}));
  console.log("Teams:", await Team.countDocuments({}));
  console.log("Activities:", await Activity.countDocuments({}));
  console.log("Leaderboard entries:", await Leaderboard.countDocuments({}));
  console.log("Workouts:", await Workout.countDocuments({}));

  await mongoose.disconnect();
}

void seed().catch(async (error) => {
  console.error("Seeding failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
