import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserRoundPlus, Edit, Trash2 } from 'lucide-react';

const DoctorsManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({ name: '', specialization: '', mobile: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/doctors');
            setDoctors(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/doctors/${editId}`, formData);
            } else {
                await api.post('/doctors', formData);
            }
            setFormData({ name: '', specialization: '', mobile: '' });
            setIsEditing(false);
            setEditId(null);
            fetchDoctors();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (d) => {
        setFormData({ name: d.doctor_name, specialization: d.specialization, mobile: d.mobile });
        setIsEditing(true);
        setEditId(d.doctor_id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await api.delete(`/doctors/${id}`);
            fetchDoctors();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Doctors Management</h1>
                <p className="text-gray-500">Register new doctors and view staff directory.</p>
            </div>

            <div className="glass-panel p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input className="input-field" placeholder="Dr. Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input className="input-field" placeholder="Specialization (e.g., Cardiology)" required value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                    <input className="input-field" placeholder="Mobile" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    <div className="md:col-span-3 flex justify-end gap-3">
                        {isEditing && <button type="button" onClick={() => {setIsEditing(false); setFormData({name:'', specialization:'', mobile:''})}} className="btn-secondary bg-gray-500 hover:bg-gray-600">Cancel</button>}
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <UserRoundPlus size={18} /> {isEditing ? 'Update Doctor' : 'Add Doctor'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map(d => (
                    <div key={d.doctor_id} className="glass-panel p-6 border-l-4 border-l-primary flex flex-col gap-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <UserRoundPlus size={64} />
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <button onClick={() => handleEdit(d)} className="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-50 shadow-sm" title="Edit Doctor"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(d.doctor_id)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm" title="Delete Doctor"><Trash2 size={16}/></button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 pr-16">{d.doctor_name}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary self-start">
                            {d.specialization}
                        </span>
                        <div className="text-gray-500 text-sm mt-4 flex items-center gap-2">
                            <span>📱 {d.mobile}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsManagement;
