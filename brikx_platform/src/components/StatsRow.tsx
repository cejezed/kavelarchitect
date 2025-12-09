import React from 'react';
import { Layers, CheckCircle, Users } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsRowProps {
  stats: DashboardStats;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Pending Listings" 
        value={stats.pendingCount} 
        icon={<Layers size={24} />} 
        color="bg-blue-600" 
      />
      <StatCard 
        title="Published Today" 
        value={stats.publishedToday} 
        icon={<CheckCircle size={24} />} 
        color="bg-emerald-500" 
      />
      <StatCard 
        title="Total Matches" 
        value={stats.totalMatches} 
        icon={<Users size={24} />} 
        color="bg-indigo-500" 
      />
    </div>
  );
};