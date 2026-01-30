import React, { useEffect, useState } from 'react';
import { Users, QrCode, DollarSign, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Loadiing from '../../../components/Loadiing/Loadiing'

const SA_Dashboard = () => {
  const [loading, setLoading] = useState(false);

  // Fake data for better visualization
  const totalUsers = { count: 12847 };
  const totalScans = { count: 45293 };
  const totalSales = { total: 187420 };
  const totalBusinesses = { count: 1834 };
  const percentages = {
    users: { diff: 12.5, message: '+12.5% from last month' },
    scans: { diff: 8.3, message: '+8.3% from last month' },
    sales: { diff: -3.2, message: '-3.2% from last month' },
    businesses: { diff: 15.7, message: '+15.7% from last month' }
  };
  const salesChartData = [
    { date: 'Jan 1', total: 12500 },
    { date: 'Jan 5', total: 15200 },
    { date: 'Jan 10', total: 18900 },
    { date: 'Jan 15', total: 22400 },
    { date: 'Jan 20', total: 19800 },
    { date: 'Jan 25', total: 25600 },
    { date: 'Feb 1', total: 28300 },
    { date: 'Feb 5', total: 31200 },
    { date: 'Feb 10', total: 27800 },
    { date: 'Feb 15', total: 35400 },
    { date: 'Feb 20', total: 38900 },
    { date: 'Feb 25', total: 42100 },
    { date: 'Mar 1', total: 39500 },
    { date: 'Mar 5', total: 45800 },
    { date: 'Mar 10', total: 48200 },
    { date: 'Mar 15', total: 52600 },
    { date: 'Mar 20', total: 49300 },
    { date: 'Mar 25', total: 56700 },
    { date: 'Apr 1', total: 61200 },
    { date: 'Apr 5', total: 58400 },
    { date: 'Apr 10', total: 64800 },
    { date: 'Apr 15', total: 69300 },
    { date: 'Apr 20', total: 72500 },
    { date: 'Apr 25', total: 68900 },
  ];
  
  if (loading) {
    return <Loadiing />
  }

  // Statistics data
  const statistics = [
    {
      id: 1,
      title: 'Total User',
      value: totalUsers?.count?.toLocaleString(),
      change: percentages?.users,
      icon: Users,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Total Scans',
      value: totalScans?.count?.toLocaleString(),
      change: percentages?.scans,
      icon: QrCode,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'Total Sales',
      value: `$${totalSales?.total?.toLocaleString()}`,
      change: percentages?.sales,
      icon: DollarSign,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'Total Businesses',
      value: totalBusinesses?.count?.toLocaleString(),
      change: percentages?.businesses,
      icon: Building2,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon size={24} className={stat.iconColor} />
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.change?.diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat?.change?.diff >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{stat?.change?.message}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Details Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Sales Details</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#009842]"></div>
              <span>Revenue</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-96 -ml-4">
          {salesChartData.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center font-semibold text-xl text-gray-400">
              No sales data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009842" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#009842" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
                    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                    return `$${value}`;
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#009842', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => {
                    if (value >= 1000000) return [`$${(value / 1000000).toFixed(2)}M`, 'Sales'];
                    if (value >= 1000) return [`$${(value / 1000).toFixed(2)}k`, 'Sales'];
                    return [`$${value}`, 'Sales'];
                  }}
                  labelStyle={{ color: 'white', fontWeight: 'bold' }}
                  cursor={{ stroke: '#009842', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#009842" 
                  strokeWidth={3}
                  fill="url(#colorValue)"
                  dot={{ fill: '#009842', strokeWidth: 2, r: 4, stroke: 'white' }}
                  activeDot={{ r: 6, fill: '#009842', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SA_Dashboard;