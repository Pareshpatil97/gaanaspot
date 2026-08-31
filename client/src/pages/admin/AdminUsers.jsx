import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const AdminUsers = () => {
  const [users] = useState([
    { _id: '1', username: 'Rahul_M', email: 'rahul@test.com', games: 142, score: 5800, role: 'user', joined: '2025-01-15' },
    { _id: '2', username: 'Admin_Super', email: 'admin@gaanaspot.com', games: 89, score: 4200, role: 'admin', joined: '2024-11-20' },
  ]);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-muted" />
            <input type="text" placeholder="Search users by name or email..." className="input-field pl-10 bg-background" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-text-secondary uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Games</th>
                <th className="px-6 py-4">High Score</th>
                <th className="px-6 py-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-surface-hover transition-colors text-text-secondary">
                  <td className="px-6 py-4 font-bold text-white">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'warning' : 'outline'}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4">{user.games}</td>
                  <td className="px-6 py-4 font-medium text-primary">{user.score}</td>
                  <td className="px-6 py-4 text-right">{new Date(user.joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
