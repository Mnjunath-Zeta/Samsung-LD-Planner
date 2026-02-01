import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Calendar, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

const VehicleCard = ({ vehicle }) => {
    const navigate = useNavigate();
    const { updateVehicle } = useData();
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [notes, setNotes] = useState(vehicle.notes || '');

    React.useEffect(() => {
        setNotes(vehicle.notes || '');
    }, [vehicle.notes]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'badge-green';
            case 'In Progress': return 'badge-blue';
            default: return 'badge-yellow';
        }
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        // Format: DD/MM/YY • HH:MM (24h)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const time = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
        return `${day}/${month}/${year} • ${time}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [y, m, d] = dateString.split('-');
        return `${d}/${m}/${y.slice(-2)}`;
    };

    const getStatusBorderColor = (status) => {
        switch (status) {
            case 'Completed': return '#16a34a';
            case 'In Progress': return '#0284c7';
            default: return '#d97706';
        }
    };

    return (
        <>
            <div
                className="card"
                onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                style={{ marginBottom: '1rem', cursor: 'pointer', borderLeft: `4px solid ${getStatusBorderColor(vehicle.status)}` }}
            >
                {/* Compact Header: Truck Num & Status */}
                <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem' }}>{vehicle.truckNumber}</h3>
                        {vehicle.vehicleType && (
                            <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                                {vehicle.vehicleType}
                            </span>
                        )}
                    </div>
                    <span className={`badge ${getStatusColor(vehicle.status)}`}>{vehicle.status}</span>
                </div>

                {/* Compact Info Row: Transporter | Destination */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {vehicle.transporterName && (
                        <>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{vehicle.transporterName}</span>
                            <span style={{ color: '#cbd5e1' }}>|</span>
                        </>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} />
                        <span>{vehicle.destination}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

                    {/* Left-Aligned Scheduled + Right-Aligned LR Details */}
                    <div style={{ background: 'var(--secondary)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, minWidth: '70px' }}>Scheduled</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} />
                                <span>{formatDate(vehicle.entryDate)} &bull; {vehicle.entryTime}</span>
                            </div>

                            {/* Notes Icon */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNotes(vehicle.notes || '');
                                    setShowNotesModal(true);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: vehicle.notes ? 'var(--primary)' : '#94a3b8',
                                    transition: 'color 0.2s'
                                }}
                                title={vehicle.notes ? 'View/Edit Notes' : 'Add Notes'}
                            >
                                <FileText size={16} fill={vehicle.notes ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Right Side: LR Details */}
                        {vehicle.lrNumber && (
                            <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginRight: '4px' }}>LR:</span>
                                    {vehicle.lrNumber}
                                </div>
                                {vehicle.lrDate && (
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        <span style={{ marginRight: '4px' }}>Date:</span>
                                        {formatDate(vehicle.lrDate)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Left-Aligned Operations */}
                    {/* Left-Aligned Operations */}
                    {(vehicle.actualEntry || vehicle.gateOut) && (
                        <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actual In</span>
                                <span style={{ color: '#065f46', fontWeight: 500 }}>{vehicle.actualEntry ? formatDateTime(vehicle.actualEntry) : '-'}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Gate Out</span>
                                <span style={{ color: '#065f46', fontWeight: 500 }}>{vehicle.gateOut ? formatDateTime(vehicle.gateOut) : '-'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notes Modal - Rendered outside the card div to prevent click bubbling issues */}
            {showNotesModal && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowNotesModal(false);
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.75rem',
                            maxWidth: '500px',
                            width: '90%',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 600 }}>
                            Notes - {vehicle.truckNumber}
                        </h3>
                        <textarea
                            id={`notes-${vehicle.id}`}
                            name="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes here..."
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        console.log('Saving notes for vehicle:', vehicle.id);
                                        console.log('New notes content:', notes);
                                        await updateVehicle(vehicle.id, { notes: notes });
                                        console.log('Update successful');
                                        setShowNotesModal(false);
                                    } catch (error) {
                                        console.error('Failed to save notes:', error);
                                        alert('Error saving notes');
                                    }
                                }}
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setNotes(vehicle.notes || '');
                                    setShowNotesModal(false);
                                }}
                                className="btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VehicleCard;
