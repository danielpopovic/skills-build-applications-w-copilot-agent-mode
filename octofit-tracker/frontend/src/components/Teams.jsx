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
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : "http://localhost:8000/api/teams/";
const fallbackApiUrl = hostname.endsWith(".app.github.dev")
  ? `https://${hostname.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev")}/api/teams/`
  : "http://localhost:8000/api/teams/";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const primaryRes = await fetch(apiUrl);
        if (!primaryRes.ok) throw new Error(`HTTP ${primaryRes.status}`);
        const json = await primaryRes.json();
        const items = Array.isArray(json) ? json : json.data ?? [];
        setTeams(items);
      } catch {
        try {
          const fallbackRes = await fetch(fallbackApiUrl);
          if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
          const json = await fallbackRes.json();
          const items = Array.isArray(json) ? json : json.data ?? [];
          setTeams(items);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadTeams();
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
