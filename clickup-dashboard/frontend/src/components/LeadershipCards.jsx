import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const leaders = [
  {
    id: "srikar",
    name: "Srikar Reddy",
    role: "Chief Executive Officer",
    summary:
      "Focused on scaling Eternal Robotics with strong culture and innovation.",
  },
  {
    id: "nitesh",
    name: "Nitesh Boyina",
    role: "Robotics Head",
    summary:
      "Driving platform stability, scalability, and engineering excellence.",
  },
  {
    id: "ajith",
    name: "Ajith Nair",
    role: "Business Development Head",
    summary:
      "Aligning user needs with long-term product roadmap.",
  },
  {
    id: "krishna",
    name: "Krishna Murthy",
    role: "Senior Delivery Manager",
    summary:
      "Ensuring smooth operations and cross-team execution.",
  },
  {
    id: "umakanth",
    name: "Umakanth Reddy",
    role: "Lead – Enterprise Solutions",
    summary:
      "Mentoring teams and maintaining high code quality.",
  },
];

export default function LeadershipCards() {
  const navigate = useNavigate();

  return (
    <div className="leadership-section">
      <h3>Leadership Messages</h3>

      <div className="leadership-grid">
        {leaders.map((leader) => (
          <div key={leader.id} className="card leader-mini">
            <h4>{leader.name}</h4>
            <p className="leader-role">{leader.role}</p>
            <p className="leader-summary">{leader.summary}</p>

            <button
              className="action-btn primary"
              onClick={() => navigate(`/leader/${leader.id}`)}
            >
              View Info
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
