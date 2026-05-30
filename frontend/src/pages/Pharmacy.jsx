import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Pill, Plus } from 'lucide-react';

const Pharmacy = () => {
    const [medicines, setMedicines] = useState([]);
    const [patients, setPatients] = useState([]);
    const [newMed, setNewMed] = useState({ medicine_name: '', price: '' });
    const [patientId, setPatientId] = useState('');
    const [quantities, setQuantities] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const fetchData = async () => {
        try {
            const resMed = await api.get('/medicines');
            setMedicines(resMed.data);
            const resPat = await api.get('/patients');
            setPatients(resPat.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        try {
            await api.post('/medicines', newMed);
            setNewMed({ medicine_name: '', price: '' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuantityChange = (id, val) => {
        setQuantities(prev => ({ ...prev, [id]: val }));
    };

    const handlePrescribeInit = (e) => {
        e.preventDefault();
        const selectedMeds = Object.entries(quantities).filter(([id, q]) => parseInt(q) > 0);
        if (selectedMeds.length === 0) {
            alert('Please specify a quantity greater than 0 for at least one medicine.');
            return;
        }
        setShowConfirm(true);
    };

    const executePrescribe = async () => {
        setShowConfirm(false);
        try {
            const selectedMeds = Object.entries(quantities)
                .filter(([id, q]) => parseInt(q) > 0)
                .map(([id, q]) => ({ medicine_id: parseInt(id), quantity: parseInt(q) }));

            await api.post('/medicines/prescribe', { patient_id: patientId, medicines: selectedMeds });
            setPatientId('');
            setQuantities({});
            setShowSuccess(true);
        } catch (error) {
            alert('Failed to prescribe. Check console.');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Confirm Prescription</h3>
                        <p className="text-gray-600 mb-6 text-sm">Are you sure you want to prescribe this medicine to the selected patient?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowConfirm(false)} className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                            <button onClick={executePrescribe} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/30">Yes, Prescribe</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowSuccess(false)}>
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 flex items-center justify-center rounded-full mx-auto mb-4">
                            <Pill size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Prescription Successful!</h3>
                        <p className="text-gray-500 mb-6 text-sm">The medicine has been successfully added to the patient's current medical record.</p>
                        <button onClick={() => setShowSuccess(false)} className="px-4 py-2 w-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold rounded-xl transition-colors">Done</button>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pharmacy Management</h1>
                <p className="text-gray-500">Manage medicine inventory and prescriptions for out-patients.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inventory Form */}
                <div className="glass-panel p-6 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-4">Add Medicine Inventory</h2>
                    <form onSubmit={handleAddMedicine} className="space-y-4">
                        <input className="input-field" placeholder="Medicine Name" required value={newMed.medicine_name} onChange={e => setNewMed({...newMed, medicine_name: e.target.value})} />
                        <input type="number" step="0.01" className="input-field" placeholder="Unit Price (₹)" required value={newMed.price} onChange={e => setNewMed({...newMed, price: e.target.value})} />
                        <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
                            <Plus size={18} /> Add to Stock
                        </button>
                    </form>

                    <div className="mt-6 max-h-64 overflow-y-auto pr-2">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="py-2 px-3 text-left">Medicine</th>
                                    <th className="py-2 px-3 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {medicines.map(m => (
                                    <tr key={m.medicine_id}>
                                        <td className="py-2 px-3 font-medium text-gray-800">{m.medicine_name}</td>
                                        <td className="py-2 px-3 text-right text-emerald-600">₹{m.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Prescribe Form */}
                <div className="glass-panel p-6 bg-blue-50/30">
                    <h2 className="text-xl font-bold text-blue-900 border-b border-blue-100 pb-4 mb-6">Prescribe to Out-Patient</h2>
                    <form onSubmit={handlePrescribeInit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                            <select required className="input-field bg-white" value={patientId} onChange={e => setPatientId(e.target.value)}>
                                <option value="">- Select Patient -</option>
                                {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.patient_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medicines (Enter Quantity)</label>
                            <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                                {medicines.map(m => (
                                    <div key={m.medicine_id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div>
                                            <p className="font-medium text-gray-800">{m.medicine_name}</p>
                                            <p className="text-sm text-emerald-600 font-bold">₹{m.price}</p>
                                        </div>
                                        <div className="w-24">
                                            <input 
                                                type="number" 
                                                min="0" 
                                                placeholder="Qty: 0" 
                                                className="input-field py-1 px-2 text-center h-9" 
                                                value={quantities[m.medicine_id] || ''} 
                                                onChange={(e) => handleQuantityChange(m.medicine_id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn-secondary w-full flex justify-center items-center gap-2 mt-2">
                            <Pill size={18} /> Prescribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Pharmacy;
