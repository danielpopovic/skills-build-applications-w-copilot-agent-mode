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
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : "http://localhost:8000/api/activities/";
const fallbackApiUrl = hostname.endsWith(".app.github.dev")
  ? `https://${hostname.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev")}/api/activities/`
  : "http://localhost:8000/api/activities/";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const primaryRes = await fetch(apiUrl);
        if (!primaryRes.ok) throw new Error(`HTTP ${primaryRes.status}`);
        const json = await primaryRes.json();
        const items = Array.isArray(json) ? json : json.data ?? [];
        setActivities(items);
      } catch {
        try {
          const fallbackRes = await fetch(fallbackApiUrl);
          if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
          const json = await fallbackRes.json();
          const items = Array.isArray(json) ? json : json.data ?? [];
          setActivities(items);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadActivities();
  }, []);

  if (loading) return <p className="text-secondary">Loading activities…</p>;
  if (error)   return <p className="text-danger">Error: {error}</p>;
  if (!activities.length) return <p className="text-secondary">No activities found.</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Activities</h2>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Calories</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a._id}>
                <td>{a.user?.name ?? a.user ?? "—"}</td>
                <td className="text-capitalize">{a.type}</td>
                <td>{a.durationMinutes}</td>
                <td>{a.caloriesBurned}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
