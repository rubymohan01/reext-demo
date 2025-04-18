import { Link, useLocation } from "react-router-dom";
import "./header.css";

import { useAuth } from "./main";
import { useState } from "react";
const Header = () => {
  const location = useLocation();
  const { handleLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src={"/growth.png"} alt="Site Icon" className="header-icon" />
          <span className="header-title">CryptoInsights</span>
          <img
            src="/hamburger.png"
            className="hamburger-menu"
            alt="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <div className={`menu ${menuOpen ? "show-menu" : "hide-menu"}`}>
            <Link to="/">
              <button
                className={`header-btn ${location.pathname === "/" ? "active-tab" : ""
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                Explore
              </button>
            </Link>
            <Link to="/dashboard">
              <button
                className={`header-btn ${location.pathname === "/dashboard" ? "active-tab" : ""
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </button>
            </Link>
            <Link to="/login">
              <button
                className="header-btn logout-btn"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
