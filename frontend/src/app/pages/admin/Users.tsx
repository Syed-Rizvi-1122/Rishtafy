import { useState } from 'react';
import { Search, BadgeCheck, UserX, UserCheck, Filter } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MOCK_USERS } from '../../lib/mockData';
import { User } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const toggleVerify = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: !u.isVerified } : u));
  };

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColor: Record<string, string> = {
    candidate: '#DBEAFE',
    guardian: '#F3E8FF',
    admin: '#FEF3C7',
  };
  const roleTextColor: Record<string, string> = {
    candidate: '#1D4ED8',
    guardian: '#7C3AED',
    admin: '#92400E',
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5A55A' }}>Admin Panel</p>
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>Manage Users</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>{users.length} total users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white"
              style={{ borderColor: '#E5E1D8' }}
              onFocus={e => e.target.style.borderColor = '#1B3B2D'}
              onBlur={e => e.target.style.borderColor = '#E5E1D8'}
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="pl-8 pr-4 py-2.5 rounded-xl border text-sm outline-none bg-white"
              style={{ borderColor: '#E5E1D8' }}
            >
              <option value="all">All Roles</option>
              <option value="candidate">Candidates</option>
              <option value="guardian">Guardians</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E1D8' }}>
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold tracking-wide" style={{ backgroundColor: '#1B3B2D', color: 'rgba(255,255,255,0.8)' }}>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2">Registered</div>
            <div className="col-span-1">Verified</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: '#6B7280' }}>No users match your search.</p>
            </div>
          ) : (
            filtered.map((user, idx) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-t items-center"
                style={{ borderColor: '#F3F4F6', backgroundColor: idx % 2 === 0 ? 'white' : '#FAFAFA' }}
              >
                {/* Name */}
                <div className="md:col-span-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#1B3B2D' }}>{user.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-3">
                  <p className="text-sm truncate" style={{ color: '#6B7280' }}>{user.email}</p>
                </div>

                {/* Role */}
                <div className="md:col-span-1">
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                    style={{ backgroundColor: roleColor[user.role], color: roleTextColor[user.role] }}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Registered */}
                <div className="md:col-span-2">
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Verified */}
                <div className="md:col-span-1">
                  {user.isVerified ? (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#16A34A' }}>
                      <BadgeCheck size={13} fill="#16A34A" color="#16A34A" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>No</span>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: user.isActive ? '#DCFCE7' : '#FEE2E2',
                      color: user.isActive ? '#166534' : '#991B1B',
                    }}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center gap-1.5 md:justify-end flex-wrap">
                  <button
                    onClick={() => toggleVerify(user.id)}
                    title={user.isVerified ? 'Remove verification' : 'Verify user'}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: user.isVerified ? '#FEF3C7' : '#DCFCE7', color: user.isVerified ? '#92400E' : '#166534' }}
                  >
                    <BadgeCheck size={13} />
                  </button>
                  <button
                    onClick={() => toggleActive(user.id)}
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: user.isActive ? '#FEE2E2' : '#DCFCE7', color: user.isActive ? '#991B1B' : '#166534' }}
                  >
                    {user.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Showing {filtered.length} of {users.length} users
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: '#9CA3AF' }}>
            <span className="flex items-center gap-1"><BadgeCheck size={11} color="#16A34A" /> {users.filter(u => u.isVerified).length} verified</span>
            <span className="flex items-center gap-1"><UserCheck size={11} color="#1B3B2D" /> {users.filter(u => u.isActive).length} active</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
