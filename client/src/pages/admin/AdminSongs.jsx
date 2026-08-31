import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const AdminSongs = () => {
  const [songs] = useState([
    { _id: '1', title: 'Tum Hi Ho', movie: 'Aashiqui 2', singer: 'Arijit Singh', year: 2013, difficulty: 'Easy' },
    { _id: '2', title: 'Chaiyya Chaiyya', movie: 'Dil Se', singer: 'Sukhwinder Singh', year: 1998, difficulty: 'Medium' },
  ]);

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Manage Songs</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Song
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-surface/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-muted" />
            <input type="text" placeholder="Search songs..." className="input-field pl-10 bg-background" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-text-secondary uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Movie</th>
                <th className="px-6 py-4">Singer</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {songs.map(song => (
                <tr key={song._id} className="hover:bg-surface-hover transition-colors text-text-secondary">
                  <td className="px-6 py-4 font-bold text-white">{song.title}</td>
                  <td className="px-6 py-4">{song.movie}</td>
                  <td className="px-6 py-4">{song.singer}</td>
                  <td className="px-6 py-4">{song.year}</td>
                  <td className="px-6 py-4">{song.difficulty}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-primary mr-2 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSongs;
