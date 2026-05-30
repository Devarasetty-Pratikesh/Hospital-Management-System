import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, UserRoundCog, BedDouble, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ patients: 0, doctors: 0, rooms: 0, revenue: 0, revenue_split: { inpatient: 0, outpatient: 0, consultation: 0 } });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formattedRevenue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 2
    }).format(stats.revenue || 0);

    const cards = [
        { title: 'Total Patients', value: stats.patients, icon: <Users size={24} className="text-primary" />, bg: 'bg-emerald-100', text: 'text-emerald-800' },
        { title: 'Total Doctors', value: stats.doctors, icon: <UserRoundCog size={24} className="text-blue-500" />, bg: 'bg-blue-100', text: 'text-blue-800' },
        { title: 'Rooms Allocated', value: stats.rooms, icon: <BedDouble size={24} className="text-purple-500" />, bg: 'bg-purple-100', text: 'text-purple-800' },
        { title: 'Total Revenue', value: formattedRevenue, icon: <DollarSign size={24} className="text-amber-500" />, bg: 'bg-amber-100', text: 'text-amber-800' }
    ];

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard data...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back! Here is what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="glass-panel p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-gray-500 font-medium text-sm">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="glass-panel p-8 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 self-start w-full border-b pb-2">Revenue Breakdown</h2>
                    {stats.revenue > 0 ? (
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Room Allocations', value: stats.revenue_split.inpatient },
                                                { name: 'Pharmacy Sales', value: stats.revenue_split.outpatient },
                                                { name: 'Doctor Consultations', value: stats.revenue_split.consultation }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell key="cell-0" fill="#3b82f6" />
                                            <Cell key="cell-1" fill="#10b981" />
                                            <Cell key="cell-2" fill="#8b5cf6" />
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                        <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">No revenue data yet</div>
                    )}
                </div>

                <div className="glass-panel p-8 text-center bg-gradient-to-br from-primary/10 to-blue-500/10 border-none flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Hospital Status System</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Explore the modules via the sidebar to manage patients, allocate rooms, prescribe medicines, and generate billing reports cleanly and efficiently.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
