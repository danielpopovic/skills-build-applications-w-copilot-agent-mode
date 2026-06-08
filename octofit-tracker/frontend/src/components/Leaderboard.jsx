import { useState, useEffect } from "react";

// API base URL: uses VITE_CODESPACE_NAME env var (define in .env.local),
// or auto-detects the Codespace name from the current hostname,
// or falls back to localhost for local development.
const viteCodespaceName = import.meta.env.VITE_CODESPACE_NAME;
const hostname = window.location.hostname;
const autoCodespaceName =
  !viteCodespaceName && hostname.endsWith(".app.github.dev")
    ? hostname.replace(".app.github.dev", "").replace(/-\d+$/, "")
    : null;
const codespaceName = viteCodespaceName || autoCodespaceName;
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : "http://localhost:8000/api/leaderboard/";
const fallbackApiUrl = hostname.endsWith(".app.github.dev")
  ? `https://${hostname.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev")}/api/leaderboard/`
  : "http://localhost:8000/api/leaderboard/";

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const primaryRes = await fetch(apiUrl);
        if (!primaryRes.ok) throw new Error(`HTTP ${primaryRes.status}`);
        const json = await primaryRes.json();
        const items = Array.isArray(json) ? json : json.data ?? [];
        setEntries(items);
      } catch {
        try {
          const fallbackRes = await fetch(fallbackApiUrl);
          if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
          const json = await fallbackRes.json();
          const items = Array.isArray(json) ? json : json.data ?? [];
          setEntries(items);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadLeaderboard();
  }, []);

  if (loading) return <p className="text-secondary">Loading leaderboard…</p>;
  if (error)   return <p className="text-danger">Error: {error}</p>;
  if (!entries.length) return <p className="text-secondary">No leaderboard data yet.</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
              <th>Week of</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id}>
                <td>#{e.rank}</td>
                <td>{e.user?.name ?? e.user ?? "—"}</td>
                <td>{e.score}</td>
                <td>{new Date(e.weekOf).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
