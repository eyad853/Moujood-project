import React, { useState } from 'react';
import { Users, QrCode, DollarSign, Building2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SA_Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('October');

  // Statistics data
  const statistics = [
    {
      id: 1,
      title: 'Total User',
      value: '40,689',
      change: '8.5% Up from last Week',
      icon: Users,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Total Scans',
      value: '10293',
      change: '1.3% Up from past week',
      icon: QrCode,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'Total Sales',
      value: '$89,000',
      change: '4.3% Up from last Week',
      icon: DollarSign,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'Total Businesses',
      value: '2040',
      change: '1.8% Up from last Week',
      icon: Building2,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
  ];

  // Sales chart data - More realistic and beautiful
  const salesData = [
    { name: '5k', value: 15000 },
    { name: '10k', value: 22000 },
    { name: '15k', value: 28000 },
    { name: '20k', value: 35000 },
    { name: '25k', value: 42000 },
    { name: '30k', value: 58000 },
    { name: '35k', value: 52000 },
    { name: '40k', value: 68000 },
    { name: '45k', value: 75000 },
    { name: '50k', value: 82000 },
    { name: '55k', value: 78000 },
    { name: '60k', value: 89000 },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon size={24} className={stat.iconColor} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Details Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Sales Details</h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm cursor-pointer"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="w-full h-96 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
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
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value;
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#009842', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                formatter={(value) => {
                  if (value >= 1000000) return [`${(value / 1000000).toFixed(2)}M`, 'Sales'];
                  if (value >= 1000) return [`${(value / 1000).toFixed(0)}k`, 'Sales'];
                  return [value, 'Sales'];
                }}
                labelStyle={{ color: 'white' }}
                cursor={{ stroke: '#009842', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#009842" 
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={{ fill: '#009842', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#009842' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SA_Dashboard;