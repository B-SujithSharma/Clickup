import "../styles/dashboard.css";
import LeadershipCards from "../components/LeadershipCards";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import LeadershipSlider from "../components/LeadershipSlider";

const API = process.env.REACT_APP_API_URL;
const USER_CACHE_KEY = "er_task_users_v1";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [overview, setOverview] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true); // 🔥 NEW

  const token = localStorage.getItem("clickup_token");

  /* ================= FETCH SYSTEM OVERVIEW ================= */
  useEffect(() => {
    if (!token) return;

    fetch(`${API}/system/overview`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setOverview(data))
      .catch(() => {});
  }, [token]);

  /* ================= LOAD USERS (CACHE FIRST) ================= */
  useEffect(() => {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      try {
        setAllTasks(JSON.parse(cached));
        setUsersLoading(false);
        return;
      } catch {}
    }

    if (!token) return;

    fetch(`${API}/tasks/all`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllTasks(data);
          localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data));
        }
        setUsersLoading(false);
      })
      .catch(() => {
        setUsersLoading(false);
      });
  }, [token]);

  /* ================= DERIVE USERS FROM TASKS ================= */
  const taskUsers = useMemo(() => {
    return Array.from(
      new Map(
        allTasks
          .flatMap((t) => t.assignees || [])
          .map((a) => [a.username.toLowerCase(), a])
      ).values()
    ).sort((a, b) => a.username.localeCompare(b.username));
  }, [allTasks]);

  return (
    <div className="dashboard">
      {/* ================= LEFT COLUMN ================= */}
      <div className="dashboard-left">
        <div className="card welcome-card full-height">
          <div className="welcome-header">
            <h2>
              Welcome{user?.username ? `, ${user.username}` : ""} 👋
            </h2>
            <p>Eternal Robotics Internal Dashboard</p>
          </div>

          <div className="welcome-quick-grid">
            <div className="card quick-card">
              <h4>🏢 Client Visits</h4>
              <ul>
                <li>Tata Motors · Wed</li>
                <li>Maruti Suzuki · Fri</li>
                <li>V-Guard · Next Week</li>
              </ul>
            </div>

            <div className="card quick-card">
              <h4>📦 Deliverables</h4>
              <ul>
                <li>Pitti Phase-2</li>
                <li>Safety AI v1.3</li>
                <li>Enterprise PoC</li>
              </ul>
            </div>

            <div className="card quick-card risk-card">
              <h4>🚨 Risks</h4>
              <ul>
                <li>Hardware delays</li>
                <li>AI data quality</li>
                <li>Site readiness</li>
              </ul>
            </div>

            <div className="card quick-card">
              <h4>⏳ Milestones</h4>
              <ul>
                <li>Q3 Freeze · 15 Jul</li>
                <li>Tata v3 · 22 Jul</li>
                <li>Go-Live · 30 Jul</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="dashboard-right-stack">
        <div className="top-stack">
          <div className="card system-card">
            <h3>System Overview</h3>

            <div className="system-row">
              <span>User</span>
              <strong>{overview?.user || "-"}</strong>
            </div>

            <div className="system-row">
              <span>Role</span>
              <strong>{overview?.role || "Engineer"}</strong>
            </div>

            <div className="system-row">
              <span>Status</span>
              <strong className="status-good">
                ● {overview?.online ? "Online" : "Offline"}
              </strong>
            </div>

            <hr className="system-divider" />

            <div className="system-row">
              <span>My Tasks</span>
              <strong>{overview?.myTasks ?? "-"}</strong>
            </div>

            <div className="system-row">
              <span>Teams</span>
              <strong>{overview?.teams ?? "-"}</strong>
            </div>

            <hr className="system-divider" />

            <div className="system-row">
              <span>System Health</span>
              <strong className="status-good">
                {overview?.systemHealth || "—"}
              </strong>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="task-actions">
              <button
                className="action-btn primary"
                onClick={() => navigate("/tasks/my")}
              >
                My Tasks
              </button>

              <button
                className="action-btn"
                onClick={() => navigate("/tasks/all")}
              >
                All Tasks
              </button>

              {/* 🔽 PERSON DROPDOWN (DISABLED UNTIL READY) */}
              <select
                className="select-inline compact"
                value={selectedUser}
                disabled={usersLoading || taskUsers.length === 0}
                onChange={(e) => {
                  const username = e.target.value;
                  setSelectedUser(username);
                  setSearchName(username);

                  if (username) {
                    navigate(
                      `/tasks/search?name=${encodeURIComponent(username)}`
                    );
                  }
                }}
              >
                <option value="">
                  {usersLoading
                    ? "Loading people..."
                    : taskUsers.length === 0
                    ? "No assignees found"
                    : "Select person"}
                </option>

                {taskUsers.map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.username}
                  </option>
                ))}
              </select>

              {/* 🔍 SEARCH INPUT */}
              <div className="search-wrapper wide">
                <input
                  className="search-inline"
                  placeholder="Search person"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setSelectedUser("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchName.trim()) {
                      navigate(
                        `/tasks/search?name=${encodeURIComponent(
                          searchName.trim()
                        )}`
                      );
                    }
                  }}
                />
                <button
                  className="search-btn-icon"
                  disabled={!searchName.trim()}
                  onClick={() =>
                    navigate(
                      `/tasks/search?name=${encodeURIComponent(
                        searchName.trim()
                      )}`
                    )
                  }
                >
                  🔍
                </button>
              </div>
            </div>
          </div>

          {/* ================= LEADERSHIP ================= */}
          <div className="card leadership-card">
            <h3>Leadership Updates</h3>
            <p className="muted">
              CEO message, weekly focus, priorities will slide here.
            </p>
            <div className="slider-placeholder">
              <LeadershipSlider />
            </div>
          </div>
        </div>

        <div className="bottom-stack">
          <LeadershipCards />
        </div>
      </div>
    </div>
  );
}
