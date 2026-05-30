import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CalendarPlus, CalendarCheck } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({ patient_id: '', doctor_id: '' });

    const fetchData = async () => {
        try {
            const [aRes, pRes, dRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/patients'),
                api.get('/doctors')
            ]);
            setAppointments(aRes.data);
            setPatients(pRes.data);
            setDoctors(dRes.data);
        } catch (error) {
            console.error('Error fetching data for appointments', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            setFormData({ patient_id: '', doctor_id: '' });
            fetchData();
            alert('Appointment scheduled and bill mapped successfully!');
        } catch (error) {
            alert('Failed to book appointment: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appointments Matrix</h1>
                <p className="text-gray-500">Book patient consultation visits and map them to billing.</p>
            </div>

            <div className="glass-panel p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
                <form onSubmit={handleBook} className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                        <select required className="input-field bg-white" value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                            <option value="">- Select Patient -</option>
                            {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.patient_name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Doctor</label>
                        <select required className="input-field bg-white" value={formData.doctor_id} onChange={e => setFormData({...formData, doctor_id: e.target.value})}>
                            <option value="">- Select Doctor -</option>
                            {doctors.map(d => (
                                <option key={d.doctor_id} value={d.doctor_id}>
                                    Dr. {d.doctor_name} ({d.specialization}) - ₹{parseFloat(d.consultation_fee || 500).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="btn-primary bg-indigo-600 hover:bg-indigo-700 pb-[9px] pt-[9px] shadow-indigo-600/30 flex items-center gap-2">
                            <CalendarPlus size={18} /> Book Visit
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-panel overflow-hidden mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="table-header">Date & Time</th>
                            <th className="table-header">Patient</th>
                            <th className="table-header">Doctor (Dept)</th>
                            <th className="table-header">Fee</th>
                            <th className="table-header text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-100">
                        {appointments.map(a => (
                            <tr key={a.appointment_id} className="hover:bg-gray-50 transition-colors">
                                <td className="table-cell">{new Date(a.appointment_date).toLocaleString()}</td>
                                <td className="table-cell font-medium">{a.patient_name}</td>
                                <td className="table-cell">Dr. {a.doctor_name} <br/><span className="text-xs text-gray-500">{a.specialization}</span></td>
                                <td className="table-cell font-bold text-gray-800">₹{parseFloat(a.fee).toFixed(2)}</td>
                                <td className="table-cell text-center">
                                    {a.is_billed ? (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Billed & Paid</span>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Queueing (Unbilled)</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Appointments;
