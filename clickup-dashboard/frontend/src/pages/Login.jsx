import "../styles/login.css";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/login";
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Eternal Robotics</h1>
        <p className="subtitle">
          Internal Execution & Leadership Dashboard
        </p>

        <button className="clickup-btn" onClick={handleLogin}>
          <img
            src="https://app.clickup.com/images/favicon.png"
            alt="ClickUp"
          />
          Login with ClickUp
        </button>

        <p className="login-footer">
          Secure authentication via ClickUp OAuth
        </p>

      </div>
    </div>
  );
}
