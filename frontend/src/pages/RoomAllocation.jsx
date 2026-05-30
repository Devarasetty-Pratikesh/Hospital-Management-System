import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BedDouble, LogIn, LogOut, PlusCircle, Trash2 } from 'lucide-react';

const RoomAllocation = () => {
    const [rooms, setRooms] = useState([]);
    const [patients, setPatients] = useState([]);
    const [admitData, setAdmitData] = useState({ patient_id: '', room_id: '' });
    const [newRoom, setNewRoom] = useState({ room_no: '', room_cost: '' });

    const fetchData = async () => {
        try {
            const resRooms = await api.get('/rooms');
            setRooms(resRooms.data);
            const resPatients = await api.get('/patients');
            setPatients(resPatients.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms/admit', admitData);
            setAdmitData({ patient_id: '', room_id: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error admitting patient');
        }
    };

    const handleDischarge = async (admission_id) => {
        if (!window.confirm('Discharge this patient? This will free up the room.')) return;
        try {
            await api.post(`/rooms/discharge/${admission_id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms', newRoom);
            setNewRoom({ room_no: '', room_cost: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding room');
        }
    };

    const handleDeleteRoom = async (room_id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        try {
            await api.delete(`/rooms/${room_id}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting room');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Room Allocation</h1>
                <p className="text-gray-500">Admit patients to available rooms and monitor occupancy.</p>
            </div>

            <div className="glass-panel p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
                <form onSubmit={handleAdmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                        <select required className="input-field" value={admitData.patient_id} onChange={e => setAdmitData({...admitData, patient_id: e.target.value})}>
                            <option value="">- Choose Patient -</option>
                            {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.patient_name} (ID: {p.patient_id})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Available Room</label>
                        <select required className="input-field" value={admitData.room_id} onChange={e => setAdmitData({...admitData, room_id: e.target.value})}>
                            <option value="">- Choose Room -</option>
                            {rooms.filter(r => !r.patient_id).map(r => <option key={r.room_id} value={r.room_id}>Room {r.room_no} - ₹{r.room_cost}/day</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary flex justify-center items-center gap-2 py-3">
                        <LogIn size={18} /> Admit Patient
                    </button>
                </form>
            </div>

            <div className="glass-panel p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                        <input type="text" required placeholder="e.g. 105" className="input-field" value={newRoom.room_no} onChange={e => setNewRoom({...newRoom, room_no: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Cost (₹/day)</label>
                        <input type="number" required placeholder="e.g. 500" className="input-field" value={newRoom.room_cost} onChange={e => setNewRoom({...newRoom, room_cost: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-secondary bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center gap-2 py-3">
                        <PlusCircle size={18} /> Add Room
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rooms.map(r => {
                    const isOccupied = !!r.patient_id;
                    return (
                        <div key={r.room_id} className={`glass-panel p-6 border-t-4 flex flex-col ${isOccupied ? 'border-amber-400' : 'border-emerald-400'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-gray-800">Room {r.room_no}</h3>
                                    {!isOccupied && (
                                        <button onClick={() => handleDeleteRoom(r.room_id)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete Room">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <BedDouble size={24} className={isOccupied ? 'text-amber-500' : 'text-emerald-500'} />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-sm">₹{r.room_cost} / day</p>
                                <div className="mt-4">
                                    {isOccupied ? (
                                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                            <p className="text-amber-800 text-sm font-semibold mb-1">Occupied By:</p>
                                            <p className="text-gray-800">{r.patient_name}</p>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 h-[68px] flex items-center justify-center">
                                            <span className="text-emerald-700 font-medium">Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isOccupied && (
                                <button onClick={() => handleDischarge(r.admission_id)} className="mt-4 btn-secondary bg-red-500 hover:bg-red-600 w-full flex items-center justify-center gap-2 text-sm">
                                    <LogOut size={16} /> Discharge
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoomAllocation;
