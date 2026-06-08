import { Link, Route, Routes } from "react-router-dom";

function Home() {
  return <p className="text-secondary">Track workouts, teams, and progress in one place.</p>;
}

function Leaderboard() {
  return <p className="text-secondary">Leaderboard feature scaffolding is ready.</p>;
}

export default function App() {
  return (
    <main className="container py-4">
      <h1 className="display-6 fw-bold mb-3">OctoFit Tracker</h1>
      <nav className="d-flex gap-3 mb-4">
        <Link to="/" className="link-primary">Home</Link>
        <Link to="/leaderboard" className="link-primary">Leaderboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </main>
  );
}
