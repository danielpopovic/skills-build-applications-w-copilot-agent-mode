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
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : "http://localhost:8000/api/users/";
const fallbackApiUrl = hostname.endsWith(".app.github.dev")
  ? `https://${hostname.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev")}/api/users/`
  : "http://localhost:8000/api/users/";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const primaryRes = await fetch(apiUrl);
        if (!primaryRes.ok) throw new Error(`HTTP ${primaryRes.status}`);
        const json = await primaryRes.json();
        const items = Array.isArray(json) ? json : json.data ?? [];
        setUsers(items);
      } catch {
        try {
          const fallbackRes = await fetch(fallbackApiUrl);
          if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
          const json = await fallbackRes.json();
          const items = Array.isArray(json) ? json : json.data ?? [];
          setUsers(items);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  if (loading) return <p className="text-secondary">Loading users…</p>;
  if (error)   return <p className="text-danger">Error: {error}</p>;
  if (!users.length) return <p className="text-secondary">No users found.</p>;

  return (
    <div>
      <h2 className="h4 mb-3">Users</h2>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Level</th>
              <th>Points</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.age}</td>
                <td className="text-capitalize">{u.fitnessLevel}</td>
                <td>{u.points}</td>
                <td>{u.team?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
