import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

/* ================= LEADER DATA ================= */
const leaderData = {
  srikar: {
    name: "Srikar Reddy",
    role: "Chief Executive Officer",
    weeklyMessage:
      "This week our focus is execution discipline, delivery predictability, and customer confidence. Outcomes matter more than activity.",
    focus: [
      "Execution quality across deployments",
      "Customer communication & trust",
      "Cross-team alignment",
      "Cost & efficiency awareness",
    ],
    projects: [
      "Enterprise PoC completion",
      "Enterprise AI pilots",
      "Q3 roadmap finalization",
    ],
    risks: [
      "Inter-team dependency delays",
      "Uncontrolled scope changes",
    ],
    actions: [
      "Escalate blockers early",
      "Close tasks before starting new work",
      "Align daily execution with outcomes",
    ],
  },

  nitesh: {
    name: "Nitesh Boyina",
    role: "Robotics Head",
    weeklyMessage:
      "Engineering reliability and safety validation remain top priorities this week.",
    focus: [
      "Hardware reliability",
      "Calibration consistency",
      "Field readiness checks",
    ],
    projects: [
      "Enterprise PoC completion",
      "CHARIOT safety validation",
    ],
    risks: [
      "Late hardware changes",
      "Unvalidated field conditions",
    ],
    actions: [
      "Freeze non-critical changes",
      "Document field issues clearly",
    ],
  },

  ajith: {
    name: "Ajith Nair",
    role: "Business Development Head",
    weeklyMessage:
      "Sales must align tightly with delivery capability and real customer value.",
    focus: [
      "Enterprise pipeline prioritization",
      "Value-based selling",
    ],
    projects: [
      "Manufacturing enterprise proposals",
      "Construction automation PoCs",
    ],
    risks: [
      "Over-promising features",
      "Delivery misalignment",
    ],
    actions: [
      "Validate commitments with delivery",
      "Focus on ROI-driven proposals",
    ],
  },

  krishna: {
    name: "Krishna Murthy",
    role: "Senior Delivery Manager",
    weeklyMessage:
      "Predictable delivery and transparency are non-negotiable.",
    focus: [
      "Deployment timelines",
      "Daily progress tracking",
    ],
    projects: [
      "Enterprise deployments",
      "Customer onboarding stabilization",
    ],
    risks: [
      "Missed handoffs",
      "Hidden blockers",
    ],
    actions: [
      "Daily status reporting",
      "Immediate escalation of risks",
    ],
  },

  umakanth: {
    name: "Umakanth Reddy",
    role: "Lead – Enterprise Solutions",
    weeklyMessage:
      "AI platforms must remain stable, observable, and production-ready.",
    focus: [
      "Hypervise platform stability",
      "Vision model accuracy",
    ],
    projects: [
      "AI safety monitoring upgrades",
      "Defect detection tuning",
    ],
    risks: [
      "Model drift",
      "Data quality issues",
    ],
    actions: [
      "Monitor production metrics",
      "Validate AI outputs continuously",
    ],
  },
};

export default function LeaderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const leader = leaderData[id];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!leader) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        Leader not found
      </div>
    );
  }

  return (
    <div style={{ padding: 32, color: "#e5e7eb" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 20,
          background: "transparent",
          color: "#38bdf8",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        ← Back to Dashboard
      </button>

      {/* HERO */}
      <div style={{ marginBottom: 24 }}>
        <h1>{leader.name}</h1>
        <p style={{ opacity: 0.8 }}>{leader.role}</p>
        <p style={{ marginTop: 12, fontSize: 15 }}>
          {leader.weeklyMessage}
        </p>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
        }}
      >
        <InfoCard title="🎯 This Week’s Focus" items={leader.focus} />
        <InfoCard title="🚀 Key Projects" items={leader.projects} />
        <InfoCard title="⚠️ Risks & Watch-outs" items={leader.risks} />
        <InfoCard title="✅ What Teams Should Do" items={leader.actions} />
      </div>
    </div>
  );
}

/* ================= REUSABLE CARD ================= */
function InfoCard({ title, items }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.8)",
        borderRadius: 14,
        padding: 18,
        border: "1px solid rgba(148,163,184,0.15)",
      }}
    >
      <h3>{title}</h3>
      <ul>
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
