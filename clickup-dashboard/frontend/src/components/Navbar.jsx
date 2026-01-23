export default function Navbar({ user }) {
  const userName = user?.username || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        height: 56,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(148,163,184,0.15)",
        background: "#020617",
      }}
    >
      {/* LEFT */}
      <strong>Eternal Robotics</strong>

      {/* CENTER */}
      <span style={{ opacity: 0.8 }}>
        Eternal Robotics – Internal Dashboard
      </span>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 13, opacity: 0.85 }}>
          {user ? userName : "Loading..."}
        </span>

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#38bdf8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#020617",
            fontWeight: 600,
          }}
        >
          {userInitial}
        </div>
      </div>
    </div>
  );
}
