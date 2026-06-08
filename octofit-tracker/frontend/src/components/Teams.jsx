import { useState, useEffect } from "react";

// API base URL using VITE_CODESPACE_NAME (define in .env.local)
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/api/teams/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json) ? json : json.data ?? [];
        setTeams(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-secondary">Loading teams…</p>;
  if (error)   return <p className="text-danger">Error: {error}</p>;
  if (!teams.length) return <p className="text-secondary">No teams found.</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Teams</h2>
      <div className="row g-3">
        {teams.map((t) => (
          <div key={t._id} className="col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{t.name}</h5>
                <p className="card-text text-muted mb-1">{t.city}</p>
                <p className="card-text">
                  <small className="text-secondary">
                    {t.members?.length ?? 0} member{t.members?.length !== 1 ? "s" : ""}
                  </small>
                </p>
                {t.totalPoints !== undefined && (
                  <span className="badge bg-primary">{t.totalPoints} pts</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
