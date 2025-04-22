import { NavLink, Link } from "react-router";
import "../style/Navbar.css";
import Logo from "./Logo";
import { useAuth } from "../context/auth.context";
import { useState } from "react";
import { useTheme } from "../context/theme.context";

function Navbar() {
  const { user, logout, profileImage, loadingImage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-dark bg-dark shadow p-4">
      <div className="container-fluid">
        <Link className="brand-Name" to="/" onClick={closeMenu}>
          <Logo />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarSupportedContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link" onClick={closeMenu} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" onClick={closeMenu} to="/about">
                About
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  onClick={closeMenu}
                  to={`/cards/my-favorite/${user._id}`}
                >
                  FAV Cards
                </NavLink>
              </li>
            )}
            {(user?.isBusiness || user?.isAdmin) && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  onClick={closeMenu}
                  to={`/cards/my-cards/${user._id}`}
                >
                  My Cards
                </NavLink>
              </li>
            )}
            {user?.isAdmin && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  onClick={closeMenu}
                  to="/admin/sandbox"
                >
                  SandBox
                </NavLink>
              </li>
            )}
          </ul>

          {!user ? (
            <ul className="navbar-nav ms-auto gap-2 mb-2 mb-md-0">
              <li className="nav-item d-flex">
                <button
                  className="btn p-1"
                  onClick={() => {
                    toggleTheme();
                    closeMenu();
                  }}
                >
                  {theme === "dark" ? (
                    <i className="bi bi-brightness-high-fill fs-5 text-white"></i>
                  ) : (
                    <i className="bi bi-moon-fill fs-5 text-white"></i>
                  )}
                </button>
              </li>
              <li className="nav-item">
                <NavLink
                  className="btn btn-outline-light me-2 my-1 my-md-0"
                  onClick={closeMenu}
                  to="/sign-in"
                >
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item d-block d-md-flex gap-2 my-1 my-md-0">
                <NavLink
                  className="btn btn-warning ml-md-1"
                  onClick={closeMenu}
                  to="/sign-up"
                >
                  Sign Up
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav gap-2 ms-auto mb-2 mb-md-0">
              <li className="nav-item d-flex">
                <button
                  className="btn p-1"
                  onClick={() => {
                    toggleTheme();
                    closeMenu();
                  }}
                >
                  {theme === "dark" ? (
                    <i className="bi bi-brightness-high-fill fs-5 text-white"></i>
                  ) : (
                    <i className="bi bi-moon-fill fs-5 text-white"></i>
                  )}
                </button>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    background: "none",
                    border: "none",
                    marginRight: "20px",
                  }}
                >
                  {loadingImage ? (
                    <div
                      className="spinner-border text-light"
                      role="status"
                      style={{ width: "22px", height: "22px" }}
                    ></div>
                  ) : (
                    <img
                      src={profileImage?.url || "../../images/defaultImage.jpg"}
                      alt={profileImage?.alt || "User Profile"}
                      className="rounded-circle"
                      height="45"
                      width="45"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "../../images/defaultImage.jpg";
                      }}
                    />
                  )}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end bg-dark fade"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item text-white"
                      onClick={closeMenu}
                      to={`/cards/create-card`}
                    >
                      Create a new card
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-white"
                      onClick={closeMenu}
                      to={`/profile/edit/${user._id}`}
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-danger"
                      onClick={closeMenu}
                      to={`/profile/delete-account/${user._id}`}
                    >
                      Delete Account
                    </Link>
                  </li>
                  <li onClick={logout}>
                    <Link
                      className="dropdown-item text-white"
                      onClick={closeMenu}
                      to="/sign-in"
                    >
                      Sign Out <i className="bi bi-box-arrow-right"></i>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
