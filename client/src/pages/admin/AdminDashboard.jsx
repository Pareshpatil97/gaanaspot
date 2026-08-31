import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Music, Activity, Target } from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Users className="text-blue-400" />} label="Total Users" value={stats?.users} />
        <StatCard icon={<Music className="text-purple-400" />} label="Total Songs" value={stats?.songs} />
        <StatCard icon={<Activity className="text-green-400" />} label="Games Today" value={stats?.gamesToday} />
        <StatCard icon={<Target className="text-red-400" />} label="Avg Score" value={stats?.avgScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/admin/songs" className="block p-4 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors">
              <div className="font-bold text-white mb-1">Manage Songs</div>
              <div className="text-sm text-text-secondary">Add, edit, or remove songs from the database</div>
            </Link>
            <Link to="/admin/users" className="block p-4 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors">
              <div className="font-bold text-white mb-1">Manage Users</div>
              <div className="text-sm text-text-secondary">View user stats and manage accounts</div>
            </Link>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <div className="text-text-secondary"><span className="text-white font-bold">User_{i}9</span> completed a Daily Game</div>
                <div className="ml-auto text-text-muted">Just now</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card p-6 flex items-center gap-4">
    <div className="p-4 bg-surface rounded-xl">
      {React.cloneElement(icon, { className: `w-8 h-8 ${icon.props.className}` })}
    </div>
    <div>
      <div className="text-text-secondary text-sm font-medium">{label}</div>
      <div className="text-3xl font-black text-white">{value?.toLocaleString()}</div>
    </div>
  </div>
);

export default AdminDashboard;
