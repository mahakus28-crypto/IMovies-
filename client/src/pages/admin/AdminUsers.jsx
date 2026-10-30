import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data?.users || []);
    } catch (err) {
      toast.error('Failed to load registered users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-white fw-bold mb-0">Registered Users</h2>
          <p className="text-secondary small">Overview of customer and administrator accounts</p>
        </div>
        <span className="badge bg-secondary p-2 fs-6">
          {users.length} Total Accounts
        </span>
      </div>

      <AdminNav />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : (
        <div className="p-4 rounded-4 border border-secondary" style={{ backgroundColor: '#131620' }}>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-secondary text-uppercase small text-secondary">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}
                        >
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white fw-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-secondary">{u.email}</td>
                    <td className="text-secondary">{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
