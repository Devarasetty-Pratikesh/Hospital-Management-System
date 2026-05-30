import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserRoundCog, BedDouble, Pill, FileText, BadgeCheck, CalendarCheck } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
        { name: 'Doctors', path: '/doctors', icon: <UserRoundCog size={20} /> },
        { name: 'Appointments', path: '/appointments', icon: <CalendarCheck size={20} /> },
        { name: 'Rooms', path: '/rooms', icon: <BedDouble size={20} /> },
        { name: 'Pharmacy', path: '/pharmacy', icon: <Pill size={20} /> },
        { name: 'Billing', path: '/billing', icon: <FileText size={20} /> },
        { name: 'Staff', path: '/staff', icon: <BadgeCheck size={20} /> },
    ];

    return (
        <aside className="w-64 min-h-screen bg-dark text-white p-6 flex flex-col gap-8 shadow-2xl z-10 sticky top-0">
            <div className="flex items-center gap-3 px-2">
                <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
                    <LayoutDashboard size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Care<span className="text-primary">HMS</span></h1>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive ? 'bg-primary shadow-lg shadow-primary/30 text-white translate-x-1' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`
                        }
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
