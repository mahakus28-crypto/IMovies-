import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNav = () => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4 border-bottom border-secondary pb-3">
      <NavLink
        to="/admin"
        end
        className={({ isActive }) =>
          `btn btn-sm ${isActive ? 'btn-danger' : 'btn-dark border border-secondary text-secondary'}`
        }
      >
        <i className="bi bi-speedometer2 me-1"></i>Dashboard Stats
      </NavLink>
      <NavLink
        to="/admin/movies"
        className={({ isActive }) =>
          `btn btn-sm ${isActive ? 'btn-danger' : 'btn-dark border border-secondary text-secondary'}`
        }
      >
        <i className="bi bi-film me-1"></i>Manage Movies
      </NavLink>
      <NavLink
        to="/admin/theatres"
        className={({ isActive }) =>
          `btn btn-sm ${isActive ? 'btn-danger' : 'btn-dark border border-secondary text-secondary'}`
        }
      >
        <i className="bi bi-buildings me-1"></i>Theatres & Screens
      </NavLink>
      <NavLink
        to="/admin/shows"
        className={({ isActive }) =>
          `btn btn-sm ${isActive ? 'btn-danger' : 'btn-dark border border-secondary text-secondary'}`
        }
      >
        <i className="bi bi-calendar3-event me-1"></i>Manage Shows
      </NavLink>
      <NavLink
        to="/admin/bookings"
        className={({ isActive }) =>
          `btn btn-sm ${isActive ? 'btn-danger' : 'btn-dark border border-secondary text-secondary'}`
        }
      >
        <i className="bi bi-ticket-detailed me-1"></i>All Bookings
      </NavLink>
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `btn btn-sm ${isActive ? 'btn-danger' : 'btn-dark border border-secondary text-secondary'}`
        }
      >
        <i className="bi bi-people me-1"></i>Users
      </NavLink>
    </div>
  );
};

export default AdminNav;
