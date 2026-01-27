import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./index.css";
import "./styles/layout.css";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeaderDetail from "./pages/LeaderDetail";
import TasksPage from "./pages/TasksPage";

/* ================= AUTH + APP ROUTES ================= */

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ Get token from URL after ClickUp login
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("clickup_token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/");
    }

    // 2️⃣ Read token from storage
    const token = localStorage.getItem("clickup_token");

    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    // 3️⃣ Fetch logged-in user from backend
    fetch(`${process.env.REACT_APP_API_URL}/me`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("clickup_token");
        setLoading(false);
        navigate("/login");
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "#e5e7eb" }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />

      <div className="page">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/leader/:id" element={<LeaderDetail />} />
          <Route path="/tasks/:type" element={<TasksPage user={user} />} />
        </Routes>
      </div>
    </>
  );
}

/* ================= ROOT ROUTER ================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
