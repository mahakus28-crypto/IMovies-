import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-5" style={{ backgroundColor: '#090a0d', borderTop: '1px solid #1c202a' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="brand-font text-white mb-3">
              <i className="bi bi-film text-danger me-2"></i><span className="text-white">I</span><span className="text-danger">Movies</span>
            </h5>
            <p className="text-secondary small mb-3">
              Experience the best cinema booking platform with instant ticket reservations, live interactive seat selection, and real-time showtime updates.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <span className="fs-5"><i className="bi bi-facebook"></i></span>
              <span className="fs-5"><i className="bi bi-twitter-x"></i></span>
              <span className="fs-5"><i className="bi bi-instagram"></i></span>
              <span className="fs-5"><i className="bi bi-youtube"></i></span>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small">Explore</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><Link to="/movies" className="text-secondary hover-text-white">Now Showing</Link></li>
              <li className="mb-2"><Link to="/movies?status=upcoming" className="text-secondary">Upcoming Movies</Link></li>
              <li className="mb-2"><Link to="/movies?genre=Action" className="text-secondary">Action Hits</Link></li>
              <li className="mb-2"><Link to="/movies?genre=Sci-Fi" className="text-secondary">Sci-Fi Thrillers</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small">Account</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><Link to="/profile" className="text-secondary">My Bookings</Link></li>
              <li className="mb-2"><Link to="/login" className="text-secondary">User Login</Link></li>
              <li className="mb-2"><Link to="/register" className="text-secondary">Create Account</Link></li>
              <li className="mb-2"><Link to="/login" className="text-secondary">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h6 className="text-white text-uppercase fw-bold mb-3 small">Demo Credentials</h6>
            <div className="p-3 rounded bg-dark border border-secondary small text-secondary">
              <div><strong className="text-white">Admin:</strong> admin@imovies.com / admin123</div>
              <div className="mt-1"><strong className="text-white">User:</strong> john@example.com / user123</div>
              <div className="mt-2 text-warning" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-shield-check me-1"></i>Mock Payment & Instant Ticket Confirmation
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: '#222834' }} />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-secondary small">
          <div>&copy; {new Date().getFullYear()} IMovies Cinema Systems. All rights reserved.</div>
          <div className="mt-2 mt-sm-0">
            <span className="me-3">Terms of Service</span>
            <span className="me-3">Privacy Policy</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
