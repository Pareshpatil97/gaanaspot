import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import { ACHIEVEMENTS } from '../utils/constants';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pData, sData, rData] = await Promise.all([
          profileService.getProfile(),
          profileService.getStats(),
          profileService.getRecentGames()
        ]);
        setProfile(pData);
        setStats(sData);
        setRecentGames(rData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 glass-card p-8 bg-gradient-to-br from-surface to-surface-hover/30">
        <Avatar src={profile?.avatar} size="xl" className="border-4 border-primary/20" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-white mb-2">{user?.username}</h1>
          <p className="text-text-secondary">{user?.email}</p>
          <p className="text-sm text-text-muted mt-4 font-medium uppercase tracking-wider">Member since {formatDate(profile?.memberSince)}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 border-b border-border pb-2">Your Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <StatCard label="Total Games" value={stats?.totalGames} />
        <StatCard label="Correct Answers" value={stats?.correctAnswers} />
        <StatCard label="Average Score" value={Math.round(stats?.avgScore)} />
        <StatCard label="High Score" value={stats?.highScore?.toLocaleString()} highlight />
        <StatCard label="Current Streak" value={stats?.currentStreak} suffix=" days" />
        <StatCard label="Best Streak" value={stats?.bestStreak} suffix=" days" />
      </div>

      <h2 className="text-xl font-bold mb-6 border-b border-border pb-2">Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {Object.entries(ACHIEVEMENTS).map(([key, ach], i) => {
          const unlocked = i < 3; // mock unlock
          return (
            <div key={key} className={`p-4 rounded-xl border flex gap-4 items-start ${unlocked ? 'glass-card border-primary/30' : 'bg-surface/30 border-border/50 opacity-60 grayscale'}`}>
              <div className="text-3xl shrink-0">{ach.emoji}</div>
              <div>
                <h4 className="font-bold text-white mb-1">{ach.title}</h4>
                <p className="text-xs text-text-secondary">{ach.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

const StatCard = ({ label, value, highlight, suffix }) => (
  <div className={`p-6 rounded-xl border ${highlight ? 'glass-card border-primary bg-primary/5' : 'bg-surface border-border'}`}>
    <div className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-2">{label}</div>
    <div className={`text-3xl font-black ${highlight ? 'text-primary' : 'text-white'}`}>
      {value || 0}<span className="text-lg font-bold text-text-muted">{suffix}</span>
    </div>
  </div>
);

export default ProfilePage;
