import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Medal } from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LeaderboardPage = () => {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardService.getLeaderboard(period).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [period]);

  const periods = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'alltime', label: 'All Time' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center mb-12">
        <div className="bg-primary/20 p-4 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-text-secondary">See how you rank against the best</p>
      </div>

      <div className="flex bg-surface rounded-xl p-1 mb-8 overflow-x-auto">
        {periods.map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
              period === p.id ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-border">
            {data.map((user, idx) => (
              <div key={user._id} className={`p-4 sm:p-6 flex items-center gap-4 transition-colors hover:bg-surface-hover ${idx < 3 ? 'bg-surface/30' : ''}`}>
                
                <div className="w-8 font-black text-lg text-center shrink-0">
                  {idx === 0 ? <Medal className="w-8 h-8 text-yellow-400 mx-auto" /> : 
                   idx === 1 ? <Medal className="w-8 h-8 text-gray-300 mx-auto" /> : 
                   idx === 2 ? <Medal className="w-8 h-8 text-amber-600 mx-auto" /> : 
                   <span className="text-text-muted">#{idx + 1}</span>}
                </div>

                <Avatar src={user.avatar} alt={user.username} />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate text-lg">{user.username}</h3>
                  <div className="flex items-center gap-4 text-xs text-text-secondary mt-1">
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-warning" /> {user.streak} day streak</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-text-secondary">
                    {user.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-muted font-bold tracking-wider uppercase mt-1">Pts</div>
                </div>
              </div>
            ))}
            
            {data.length === 0 && (
              <div className="p-12 text-center text-text-muted">
                No scores yet for this period. Be the first!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
