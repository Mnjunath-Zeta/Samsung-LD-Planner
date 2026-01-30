import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Calendar } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
    const navigate = useNavigate();

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

    return (
        <div
            className="card"
            onClick={() => navigate(`/vehicle/${vehicle.id}`)}
            style={{ marginBottom: '1rem', cursor: 'pointer', borderLeft: '4px solid var(--primary)' }}
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
                {(vehicle.actualEntry || vehicle.gateOut) && (
                    <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1fae5', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {vehicle.actualEntry && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <span style={{ color: '#047857', fontWeight: 600, minWidth: '70px' }}>Actual In</span>
                                <span style={{ color: '#065f46' }}>{formatDateTime(vehicle.actualEntry)}</span>
                            </div>
                        )}
                        {vehicle.gateOut && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <span style={{ color: '#047857', fontWeight: 600, minWidth: '70px' }}>Gate Out</span>
                                <span style={{ color: '#065f46' }}>{formatDateTime(vehicle.gateOut)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleCard;
