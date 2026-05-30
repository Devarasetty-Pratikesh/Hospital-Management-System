import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

const PatientsManagement = () => {
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({ name: '', gender: 'Male', dob: '', mobile: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/patients');
            setPatients(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/patients/${editId}`, formData);
            } else {
                await api.post('/patients', formData);
            }
            setFormData({ name: '', gender: 'Male', dob: '', mobile: '' });
            setIsEditing(false);
            setEditId(null);
            fetchPatients();
        } catch (error) {
            alert('Failed to save patient. Check console.');
            console.error(error);
        }
    };

    const handleEdit = (p) => {
        setFormData({ name: p.patient_name, gender: p.gender, dob: p.dob.split('T')[0], mobile: p.mobile });
        setIsEditing(true);
        setEditId(p.patient_id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/patients/${id}`);
            fetchPatients();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Management</h1>
                <p className="text-gray-500">Register and manage hospital patients.</p>
            </div>

            <div className="glass-panel p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <input className="input-field" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="date" className="input-field" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                    <input className="input-field" placeholder="Mobile" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    <div className="md:col-span-4 flex justify-end gap-4">
                        {isEditing && <button type="button" onClick={() => {setIsEditing(false); setFormData({name:'', gender:'Male', dob:'', mobile:''})}} className="btn-secondary bg-gray-500 hover:bg-gray-600">Cancel</button>}
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <UserPlus size={18} /> {isEditing ? 'Update Patient' : 'Add Patient'}
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
                            <th className="table-header">Gender</th>
                            <th className="table-header">DOB</th>
                            <th className="table-header">Mobile</th>
                            <th className="table-header text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-100">
                        {patients.map(p => (
                            <tr key={p.patient_id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="table-cell font-medium text-gray-900">#{p.patient_id}</td>
                                <td className="table-cell">{p.patient_name}</td>
                                <td className="table-cell">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.gender==='Male'?'bg-blue-100 text-blue-800':p.gender==='Female'?'bg-pink-100 text-pink-800':'bg-gray-100 text-gray-800'}`}>
                                        {p.gender}
                                    </span>
                                </td>
                                <td className="table-cell">{new Date(p.dob).toLocaleDateString()}</td>
                                <td className="table-cell">{p.mobile}</td>
                                <td className="table-cell text-right space-x-3">
                                    <button onClick={() => handleEdit(p)} className="text-secondary hover:text-blue-700 transition-colors"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(p.patient_id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientsManagement;
