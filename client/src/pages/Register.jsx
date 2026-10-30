import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = formData;

    if (!name || !email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password, phone);
      toast.success(`Account created! Welcome, ${user.name}!`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="p-4 p-md-5 rounded-4 border border-secondary shadow-lg" style={{ backgroundColor: '#131620' }}>
            <div className="text-center mb-4">
              <h2 className="brand-font text-white fw-bold">
                <i className="bi bi-film text-danger me-2"></i>Join <span className="text-danger">IMovies</span>
              </h2>
              <p className="text-secondary small">Create an account to book cinema tickets seamlessly</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="+1 555 0192"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Password (min 6 chars) *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-imovies w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-4 text-secondary small">
              Already have an account?{' '}
              <Link to="/login" className="text-danger fw-bold">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
