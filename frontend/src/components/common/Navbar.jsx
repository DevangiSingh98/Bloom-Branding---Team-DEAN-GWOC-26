import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/" className="logo">
        <img
          src="/images/logos/Bloom Logo.png"
          alt="Bloom Branding Logo"
        />
      </Link>

      <div className="mobile-menu-btn">☰</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Our Story</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/work">Work</Link></li>
        <li>
          <Link to="/contact" className="cta-btn">
            Brand Enquiry
          </Link>
        </li>
      </ul>
    </nav>
  );
}
