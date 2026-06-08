import { useState, useEffect } from "react";

// API base URL using VITE_CODESPACE_NAME (define in .env.local)
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/api/users/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json) ? json : json.data ?? [];
        setUsers(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
