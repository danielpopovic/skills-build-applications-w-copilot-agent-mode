import { useState, useEffect } from "react";

// API base URL using VITE_CODESPACE_NAME (define in .env.local)
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/api/workouts/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json) ? json : json.data ?? [];
        setWorkouts(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
