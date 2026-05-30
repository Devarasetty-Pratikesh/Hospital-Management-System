import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, BadgeCheck } from 'lucide-react';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({ fname: '', lname: '', username: '', designation: '', mobile: '' });

    const fetchStaff = async () => {
        try {
            const res = await api.get('/staff');
            setStaff(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/staff', formData);
            setFormData({ fname: '', lname: '', username: '', designation: '', mobile: '' });
            fetchStaff();
        } catch (error) {
            alert('Failed to save staff. Check console.');
            console.error(error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
                <p className="text-gray-500">Manage hospital staff credentials and details.</p>
            </div>

            <div className="glass-panel p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <input className="input-field" placeholder="First Name" required value={formData.fname} onChange={e => setFormData({...formData, fname: e.target.value})} />
                    <input className="input-field" placeholder="Last Name" required value={formData.lname} onChange={e => setFormData({...formData, lname: e.target.value})} />
                    <input className="input-field" placeholder="Username" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                    <input className="input-field" placeholder="Designation" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                    <input className="input-field" placeholder="Mobile" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    <div className="md:col-span-5 flex justify-end">
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <UserPlus size={18} /> Add Staff
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="table-header">ID</th>
                            <th className="table-header">Name</th>
                            <th className="table-header">Username</th>
                            <th className="table-header">Designation</th>
                            <th className="table-header">Mobile</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-100">
                        {staff.map(s => (
                            <tr key={s.staff_id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="table-cell font-medium text-gray-900">#{s.staff_id}</td>
                                <td className="table-cell">{s.first_name} {s.last_name}</td>
                                <td className="table-cell text-primary font-medium">@{s.username}</td>
                                <td className="table-cell">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                        {s.designation}
                                    </span>
                                </td>
                                <td className="table-cell">{s.mobile}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;
