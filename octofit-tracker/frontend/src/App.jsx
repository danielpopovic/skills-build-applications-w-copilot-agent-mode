import { NavLink, Route, Routes } from "react-router-dom";
import Activities from "./components/Activities.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Teams from "./components/Teams.jsx";
import Users from "./components/Users.jsx";
import Workouts from "./components/Workouts.jsx";

function Home() {
  return (
    <div>
      <p className="lead">Track workouts, teams, and progress in one place.</p>
      <p className="text-secondary">
        Use the navigation above to explore users, teams, activities, the leaderboard, and workouts.
      </p>
    </div>
  );
}

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/users", label: "Users" },
  { to: "/teams", label: "Teams" },
  { to: "/activities", label: "Activities" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/workouts", label: "Workouts" },
];

export default function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <span className="navbar-brand fw-bold">OctoFit Tracker</span>
        <div className="navbar-nav gap-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-semibold" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}
