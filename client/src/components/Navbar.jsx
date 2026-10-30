import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-imovies sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="navbar-brand-logo">
            <i className="bi bi-film text-danger me-1"></i><span className="text-white">I</span><span className="text-danger">Movies</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setNavCollapsed(!navCollapsed)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links & Actions */}
        <div className={`collapse navbar-collapse ${navCollapsed ? '' : 'show'}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active text-white fw-bold' : ''}`}
                to="/"
                onClick={() => setNavCollapsed(true)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active text-white fw-bold' : ''}`}
                to="/movies"
                onClick={() => setNavCollapsed(true)}
              >
                Explore Movies
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link nav-link-custom text-warning ${isActive ? 'active fw-bold' : ''}`}
                  to="/admin"
                  onClick={() => setNavCollapsed(true)}
                >
                  <i className="bi bi-speedometer2 me-1"></i>Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          {/* Quick Search */}
          <form className="d-flex me-lg-3 mb-2 mb-lg-0" onSubmit={handleSearchSubmit}>
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '180px' }}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <i className="bi bi-search text-white"></i>
              </button>
            </div>
          </form>

          {/* User Auth Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark border-secondary dropdown-toggle d-flex align-items-center gap-2 text-white"
                  type="button"
                  data-bs-toggle="dropdown"
                  id="userDropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem', fontWeight: 'bold' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="small">{user?.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow" aria-labelledby="userDropdown">
                  <li className="px-3 py-2 small text-muted border-bottom border-secondary">
                    Signed in as <br />
                    <strong className="text-white">{user?.email}</strong>
                    {isAdmin && <span className="badge bg-danger ms-2">Admin</span>}
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/profile" onClick={() => setNavCollapsed(true)}>
                      <i className="bi bi-person-circle me-2"></i>My Profile & Bookings
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2 text-warning" to="/admin" onClick={() => setNavCollapsed(true)}>
                        <i className="bi bi-gear-fill me-2"></i>Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-imovies-outline">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-imovies">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
