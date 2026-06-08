import { useState, useEffect } from "react";

// API base URL using VITE_CODESPACE_NAME (define in .env.local)
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/api/activities/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json) ? json : json.data ?? [];
        setActivities(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
