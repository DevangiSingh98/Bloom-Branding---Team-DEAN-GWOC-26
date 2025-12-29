import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #333",
        padding: "80px var(--container-padding)",
        marginTop: "50px",
      }}
    >
      <div className="flex-row">
        <div>
          <Link to="/" className="logo">
            <img
              src="/images/logos/Bloom Logo.png"
              alt="Bloom Branding Logo"
            />
          </Link>
        </div>

        <div style={{ fontSize: "0.9rem", color: "#555" }}>
          © 2025 Bloom Branding.
        </div>
      </div>
    </footer>
  );
}
