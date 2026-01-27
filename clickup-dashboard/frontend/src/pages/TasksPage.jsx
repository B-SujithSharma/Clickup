import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "../styles/tasks.css";

const API = "http://localhost:5000";
const PAGE_SIZE = 12;

export default function TasksPage() {
  const { type, userId } = useParams(); // my | all | search | user
  const [searchParams] = useSearchParams();
  const searchName = searchParams.get("name");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // 🔍 search inside ALL TASKS page
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("clickup_token");

  /* reset page when route changes */
  useEffect(() => {
    setPage(0);
  }, [type, searchName, userId]);

  /* fetch tasks */
  useEffect(() => {
    if (!token) return;
    fetchTasks();
    // eslint-disable-next-line
  }, [type, searchName, userId]);

  async function fetchTasks() {
    setLoading(true);

    let url = "";

    if (type === "search") {
      if (!searchName?.trim()) {
        setTasks([]);
        setLoading(false);
        return;
      }
      url = `${API}/tasks/by-name?name=${encodeURIComponent(
        searchName.trim()
      )}`;
    } 
    else if (type === "my") {
      url = `${API}/tasks`;
    } 
    else if (type === "all" || type === "user") {
      // 🔥 OPTION B: always load ALL tasks
      url = `${API}/tasks/all`;
    } 
    else {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(url, {
        headers: { Authorization: token },
      });
      const data = await res.json();

      let allTasks = [];

      if (Array.isArray(data)) {
        allTasks = data;
      } else if (data?.tasks) {
        allTasks = data.tasks;
      }

      // 🔥 FILTER BY USER ID (CLIENT SIDE)
      if (type === "user" && userId) {
        allTasks = allTasks.filter((task) =>
          task.assignees?.some(
            (a) => String(a.id) === String(userId)
          )
        );
      }

      setTasks(allTasks);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  /* pagination only for MY TASKS */
  const paginatedTasks =
    type === "my"
      ? tasks.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
      : tasks;

  /* 🔍 FILTER ONLY FOR ALL TASKS */
  const visibleTasks =
    type === "all" && filter.trim()
      ? paginatedTasks.filter((task) => {
          const q = filter.toLowerCase();
          const name = task.name?.toLowerCase() || "";
          const assignees =
            task.assignees?.map((a) => a.username.toLowerCase()).join(" ") ||
            "";

          return name.includes(q) || assignees.includes(q);
        })
      : paginatedTasks;

  return (
    <div className="tasks-page">
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      <h2 className="tasks-title">
        {type === "my"
          ? "My Tasks"
          : type === "all"
          ? "All Tasks"
          : type === "user"
          ? "Tasks by User"
          : `Tasks for "${searchName}"`}
      </h2>

      {/* 🔍 SEARCH INSIDE ALL TASKS */}
      {type === "all" && (
        <input
          className="search-inline"
          placeholder="Search task or assignee…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 320, marginBottom: 16 }}
        />
      )}

      {/* LOADER */}
      {loading && (
        <div className="neon-loader">
          <div className="neon-bar" />
        </div>
      )}

      {!loading && visibleTasks.length === 0 && (
        <p className="muted">No tasks found</p>
      )}

      {/* TASK GRID */}
      <div className="tasks-grid">
        {visibleTasks.map((task) => {
          const rawStatus = task.status?.status || "todo";
          const status = rawStatus.toLowerCase().replace(/\s+/g, "-");

          const assignees =
            task.assignees?.map((a) => a.username).join(", ") ||
            "Unassigned";

          return (
            <div
              key={task.id}
              className={`task-card status-${status}`}
              onClick={() => window.open(task.url, "_blank")}
            >
              <div className="task-title">{task.name}</div>

              <div className="task-footer">
                <span className="task-status">{rawStatus}</span>
                <span className="task-assignees">{assignees}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION → ONLY MY TASKS */}
      {type === "my" && tasks.length > PAGE_SIZE && (
        <div className="pagination">
          <button
            className="action-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <button
            className="action-btn"
            disabled={(page + 1) * PAGE_SIZE >= tasks.length}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
