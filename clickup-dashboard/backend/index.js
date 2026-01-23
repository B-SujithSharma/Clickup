const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

function normalize(str = "") {
  return str.toLowerCase().replace(/[^a-z]/g, "");
}
/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

/* =========================================================
   1️⃣ LOGIN WITH CLICKUP (OAUTH START)
========================================================= */
app.get("/auth/login", (req, res) => {
  const authUrl =
    "https://app.clickup.com/api" +
    "?client_id=" + process.env.CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(process.env.REDIRECT_URI) +
    "&response_type=code";

  res.redirect(authUrl);
});

/* =========================================================
   2️⃣ CALLBACK – EXCHANGE CODE FOR TOKEN
========================================================= */
app.get("/auth/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("No authorization code received");
    }

    const tokenRes = await axios.post(
      "https://api.clickup.com/api/v2/oauth/token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI, // 🔴 REQUIRED
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Redirect back to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${accessToken}`);
  } catch (err) {
    console.error("OAuth Error:", err.response?.data || err.message);
    res.status(500).send("OAuth failed");
  }
});

/* =========================================================
   3️⃣ GET LOGGED-IN USER
========================================================= */
app.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const response = await axios.get(
      "https://api.clickup.com/api/v2/user",
      { headers: { Authorization: token } }
    );

    res.json(response.data);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

/* =========================================================
   4️⃣ GET ALL TEAM USERS (FOR SEARCH BY NAME)
========================================================= */
app.get("/team-users", async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Get team
    const teamsRes = await axios.get(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: token } }
    );
    const teamId = teamsRes.data.teams[0].id;

    // Get users
    const usersRes = await axios.get(
      `https://api.clickup.com/api/v2/team/${teamId}/user`,
      { headers: { Authorization: token } }
    );

    res.json(usersRes.data.users);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch team users" });
  }
});

/* =========================================================
   5️⃣ GET ONLY MY TASKS
========================================================= */
app.get("/tasks", async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Logged-in user
    const userRes = await axios.get(
      "https://api.clickup.com/api/v2/user",
      { headers: { Authorization: token } }
    );
    const userId = userRes.data.user.id;

    // Team
    const teamsRes = await axios.get(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: token } }
    );
    const teamId = teamsRes.data.teams[0].id;

    // Tasks assigned to user
    const tasksRes = await axios.get(
      `https://api.clickup.com/api/v2/team/${teamId}/task`,
      {
        headers: { Authorization: token },
        params: {
          assignees: [userId],
          page: 0,
        },
      }
    );

    res.json(tasksRes.data.tasks);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch user tasks" });
  }
});

/* =========================================================
   6️⃣ GET TASKS BY PERSON NAME
========================================================= */
app.get("/tasks/by-name", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const search = normalize(name);

    // 1️⃣ Get team
    const teamsRes = await axios.get(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: token } }
    );
    const teamId = teamsRes.data.teams[0].id;

    // 2️⃣ Get ALL TASKS (safe way)
    let allTasks = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const tasksRes = await axios.get(
        `https://api.clickup.com/api/v2/team/${teamId}/task`,
        {
          headers: { Authorization: token },
          params: {
            page,
            include_closed: true,
            subtasks: true,
          },
        }
      );

      allTasks.push(...tasksRes.data.tasks);
      hasMore = tasksRes.data.tasks.length === 100;
      page++;
    }

    // 3️⃣ FILTER BY ASSIGNEE NAME (FUZZY)
    const filteredTasks = allTasks.filter((task) =>
      task.assignees?.some((a) =>
        normalize(a.username).includes(search)
      )
    );

    res.json({
      assignee: name,
      tasks: filteredTasks,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tasks by name" });
  }
});

/* =========================================================
   7️⃣ GET ALL TEAM TASKS (SEARCH / ANALYTICS)
========================================================= */
app.get("/tasks/all", async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Team
    const teamsRes = await axios.get(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: token } }
    );
    const teamId = teamsRes.data.teams[0].id;

    let allTasks = [];
    let page = 0;
    let hasMore = true;
    while (true) {
      const tasksRes = await axios.get(
        `https://api.clickup.com/api/v2/team/${teamId}/task`,
        {
          headers: { Authorization: token },
          params: {
            page,
            limit: 100,          // 🔴 REQUIRED
            include_closed: true,
            subtasks: true,
          },
        }
      );

      const tasks = tasksRes.data.tasks || [];
      allTasks.push(...tasks);

      if (tasks.length < 100) break; // ✅ last page
      page++;
    }


    res.json(allTasks);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch all tasks" });
  }
});

/* =========================================================
   8️⃣ SYSTEM OVERVIEW SUMMARY
========================================================= */
app.get("/system/overview", async (req, res) => {
  try {
    const token = req.headers.authorization;

    // USER
    const userRes = await axios.get(
      "https://api.clickup.com/api/v2/user",
      { headers: { Authorization: token } }
    );
    const user = userRes.data.user;

    // TEAMS
    const teamsRes = await axios.get(
      "https://api.clickup.com/api/v2/team",
      { headers: { Authorization: token } }
    );
    const teamId = teamsRes.data.teams[0].id;
    const teamCount = teamsRes.data.teams.length;

    // MY TASKS
    const myTasksRes = await axios.get(
      `https://api.clickup.com/api/v2/team/${teamId}/task`,
      {
        headers: { Authorization: token },
        params: { assignees: [user.id] },
      }
    );

    // ALL TASKS
    const allTasksRes = await axios.get(
      `https://api.clickup.com/api/v2/team/${teamId}/task`,
      {
        headers: { Authorization: token },
      }
    );

    res.json({
      user: user.username,
      role: user.role || "Engineer",
      online: true,
      myTasks: myTasksRes.data.tasks.length,
      allTasks: allTasksRes.data.tasks.length,
      teams: teamCount,
      systemHealth: "Operational",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "System overview failed" });
  }
});

/* =========================================================
   SERVER START
========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
