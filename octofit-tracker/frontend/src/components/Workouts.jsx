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
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : "http://localhost:8000/api/workouts/";
const fallbackApiUrl = hostname.endsWith(".app.github.dev")
  ? `https://${hostname.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev")}/api/workouts/`
  : "http://localhost:8000/api/workouts/";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const primaryRes = await fetch(apiUrl);
        if (!primaryRes.ok) throw new Error(`HTTP ${primaryRes.status}`);
        const json = await primaryRes.json();
        const items = Array.isArray(json) ? json : json.data ?? [];
        setWorkouts(items);
      } catch {
        try {
          const fallbackRes = await fetch(fallbackApiUrl);
          if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
          const json = await fallbackRes.json();
          const items = Array.isArray(json) ? json : json.data ?? [];
          setWorkouts(items);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadWorkouts();
  }, []);

  if (loading) return <p className="text-secondary">Loading workouts…</p>;
  if (error)   return <p className="text-danger">Error: {error}</p>;
  if (!workouts.length) return <p className="text-secondary">No workouts found.</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Workouts</h2>
      <div className="row g-3">
        {workouts.map((w) => (
          <div key={w._id} className="col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{w.title}</h5>
                <p className="card-text text-muted text-capitalize mb-1">
                  {w.category} · {w.difficulty}
                </p>
                <p className="card-text">
                  <small>{w.durationMinutes} min</small>
                </p>
                {w.targetMuscleGroups?.length > 0 && (
                  <p className="card-text">
                    <small className="text-secondary">
                      {w.targetMuscleGroups.join(", ")}
                    </small>
                  </p>
                )}
                <span className="badge bg-success text-capitalize">
                  {w.suggestedForLevel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
