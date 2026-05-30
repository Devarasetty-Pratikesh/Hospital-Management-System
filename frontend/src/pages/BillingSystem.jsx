import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Calculator } from 'lucide-react';

const BillingSystem = () => {
    const [bills, setBills] = useState([]);
    const [outpatientBills, setOutpatientBills] = useState([]);
    const [admissions, setAdmissions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [admissionId, setAdmissionId] = useState('');
    const [patientId, setPatientId] = useState('');
    const [activeTab, setActiveTab] = useState('inpatient');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [generatedBillId, setGeneratedBillId] = useState(null);
    const [confirmStatusBillId, setConfirmStatusBillId] = useState(null);

    const fetchData = async () => {
        try {
            const bRes = await api.get('/billing');
            setBills(bRes.data);
            
            const obRes = await api.get('/billing/outpatient');
            setOutpatientBills(obRes.data);
            
            const rRes = await api.get('/rooms');
            const occupied = rRes.data.filter(r => r.patient_id && r.admission_id);
            setAdmissions(occupied);

            const pRes = await api.get('/patients');
            setPatients(pRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleGenerateBill = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (activeTab === 'inpatient') {
                res = await api.post('/billing/generate', { admission_id: admissionId, status: 'Unpaid' });
                setAdmissionId('');
            } else {
                res = await api.post('/billing/outpatient/generate', { patient_id: patientId, status: 'Unpaid' });
                setPatientId('');
            }
            setGeneratedBillId(res.data.bill_id);
            setShowPaymentModal(true);
            fetchData();
        } catch (error) {
            alert('Error generating bill. ' + (error.response?.data?.message || ''));
        }
    };

    const handleLatePayment = async (status) => {
        try {
            if(status === 'Paid') {
                const url = activeTab === 'inpatient' ? `/billing/${generatedBillId}/status` : `/billing/outpatient/${generatedBillId}/status`;
                await api.put(url, { status: 'Paid' });
                fetchData();
            }
            setShowPaymentModal(false);
            setGeneratedBillId(null);
        } catch(err) {
            console.error(err);
        }
    };

    const executeMarkPaid = async () => {
        try {
            const url = activeTab === 'inpatient' ? `/billing/${confirmStatusBillId}/status` : `/billing/outpatient/${confirmStatusBillId}/status`;
            await api.put(url, { status: 'Paid' });
            setConfirmStatusBillId(null);
            fetchData();
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
            {/* Payment Modal After Generation */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Bill Generated!</h3>
                        <p className="text-gray-500 mb-6 text-sm">The bill has been created successfully. Would you like to mark it as paid right now?</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleLatePayment('Unpaid')} className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors">Keep Unpaid</button>
                            <button onClick={() => handleLatePayment('Paid')} className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/30">Mark as Paid</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Mark Paid Modal */}
            {confirmStatusBillId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Confirm Payment</h3>
                        <p className="text-gray-600 mb-6 text-sm">Are you sure you want to mark this bill as Paid? This action cannot be easily undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmStatusBillId(null)} className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                            <button onClick={executeMarkPaid} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-600/30">Confirm Payment</button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Finance</h1>
                <p className="text-gray-500">Generate and review patient bills based on room occupancy.</p>
            </div>

            <div className="flex gap-4 border-b">
                <button 
                    className={`py-2 px-6 font-semibold transition-colors border-b-2 ${activeTab === 'inpatient' ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('inpatient')}
                >
                    In-Patient Billing
                </button>
                <button 
                    className={`py-2 px-6 font-semibold transition-colors border-b-2 ${activeTab === 'outpatient' ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('outpatient')}
                >
                    Out-Patient Pharmacy
                </button>
            </div>

            <div className="glass-panel p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                <form onSubmit={handleGenerateBill} className="flex flex-col md:flex-row items-end gap-4 max-w-3xl">
                    <div className="flex-1 w-full">
                        {activeTab === 'inpatient' ? (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Active Admission</label>
                                <select required className="input-field bg-white" value={admissionId} onChange={e => setAdmissionId(e.target.value)}>
                                    <option value="">- Select Admitted Patient -</option>
                                    {admissions.map(a => (
                                        <option key={a.admission_id} value={a.admission_id}>
                                            {a.patient_name} (Room {a.room_no})
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Out-Patient</label>
                                <select required className="input-field bg-white" value={patientId} onChange={e => setPatientId(e.target.value)}>
                                    <option value="">- Select Out-Patient -</option>
                                    {patients.map(p => (
                                        <option key={p.patient_id} value={p.patient_id}>
                                            {p.patient_name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                    <button type="submit" className="btn-primary bg-amber-500 hover:bg-amber-600 pb-[9px] pt-[9px] shadow-amber-500/30 flex items-center gap-2">
                        <Calculator size={18} /> Generate {activeTab === 'inpatient' ? 'Final' : 'Pharmacy'} Bill
                    </button>
                </form>
            </div>

            <div className="glass-panel overflow-hidden mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="table-header">Bill ID</th>
                            <th className="table-header">Patient Name</th>
                            <th className="table-header">{activeTab === 'inpatient' ? 'Admitted On' : 'Bill Date'}</th>
                            <th className="table-header text-right">Total Amount</th>
                            <th className="table-header text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-100">
                        {(activeTab === 'inpatient' ? bills : outpatientBills).map(b => (
                            <tr key={b.bill_id} className="hover:bg-gray-50 transition-colors">
                                <td className="table-cell font-medium">#{b.bill_id}</td>
                                <td className="table-cell">{b.patient_name}</td>
                                <td className="table-cell">{new Date(activeTab === 'inpatient' ? b.admission_date : b.bill_date).toLocaleString()}</td>
                                <td className="table-cell text-right font-bold text-lg text-emerald-600">₹{parseFloat(b.total).toFixed(2)}</td>
                                <td className="table-cell text-center">
                                    {b.status === 'Paid' ? (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Paid / Finalized</span>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Unpaid</span>
                                            <button onClick={() => setConfirmStatusBillId(b.bill_id)} className="text-xs text-blue-600 hover:text-blue-800 underline">Mark as Paid</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {(activeTab === 'inpatient' ? bills : outpatientBills).length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No {activeTab} bills generated yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillingSystem;
