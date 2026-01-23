import "../styles/dashboard.css";
import LeadershipCards from "../components/LeadershipCards";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LeadershipSlider from "../components/LeadershipSlider";

const API = "http://localhost:5000";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [overview, setOverview] = useState(null);
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

  return (
    <div className="dashboard">

      {/* ================= LEFT COLUMN ================= */}
      <div className="dashboard-left">

        {/* WELCOME CARD */}
        <div className="card welcome-card full-height">

          <div className="welcome-header">
            <h2>
              Welcome{user?.username ? `, ${user.username}` : ""} 👋
            </h2>
            <p>Eternal Robotics Internal Dashboard</p>
          </div>

          {/* QUICK CARDS */}
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

        {/* ===== TOP 60% ===== */}
        <div className="top-stack">

          {/* SYSTEM OVERVIEW */}
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

            {/* <div className="system-row">
              <span>ER Tasks</span>
              <strong>{overview?.allTasks ?? "-"}</strong>
            </div> */}

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

            {/* ACTIONS */}
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

              <input
                className="search-inline"
                placeholder="Search person"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />

              <button
                className="action-btn"
                disabled={!searchName.trim()}
                onClick={() =>
                  navigate(
                    `/tasks/search?name=${encodeURIComponent(
                      searchName.trim()
                    )}`
                  )
                }
              >
                Search
              </button>
            </div>
          </div>

          {/* LEADERSHIP SLIDER */}
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

        {/* ===== BOTTOM 40% ===== */}
        <div className="bottom-stack">
          <LeadershipCards />
        </div>

      </div>
    </div>
  );
}
