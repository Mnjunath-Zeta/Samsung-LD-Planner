import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { vehicles, addVehicle, updateVehicle } = useData();
    const { isAdmin } = useAuth();

    const existingVehicle = id ? vehicles.find(v => v.id === id) : null;

    const [formData, setFormData] = useState(existingVehicle || {
        truckNumber: '',
        vehicleType: '',
        transporterName: '',
        destination: '',
        entryDate: '',
        entryTime: '',
        actualEntry: '',
        gateOut: '',
        lrNumber: '',
        lrDate: '',
        ewayBill: '',
        ewayBillExpiry: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            updateVehicle(id, formData);
        } else {
            addVehicle(formData);
        }
        navigate('/');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [y, m, d] = dateString.split('-');
        return `${d}/${m}/${y.slice(-2)}`;
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const time = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
        return `${day}/${month}/${year} ${time}`;
    };

    const renderField = (label, name, type, isDisabled) => {
        const displayValue = formData[name];

        // If Disabled (locked), just show formatted text
        if (isDisabled) {
            let formattedValue = displayValue;
            if (type === 'date' && displayValue) formattedValue = formatDate(displayValue);
            if (type === 'datetime-local' && displayValue) formattedValue = formatDateTime(displayValue);

            return (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {label}
                    </label>
                    <div style={{
                        padding: '0.5rem',
                        background: '#f7fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        color: '#718096'
                    }}>
                        {formattedValue || '-'}
                    </div>
                </div>
            );
        }

        // For datetime-local, use manual text inputs
        if (!isDisabled && type === 'datetime-local') {
            const isoDateTime = formData[name] || '';
            let displayDate = '';
            let displayTime = '';

            if (isoDateTime) {
                const [datePart, timePart] = isoDateTime.split('T');
                if (datePart) {
                    const [y, m, d] = datePart.split('-');
                    displayDate = `${d}/${m}/${y.slice(-2)}`;
                }
                if (timePart) {
                    displayTime = timePart.substring(0, 5);
                }
            }

            const handleManualInput = (field, value) => {
                if (field === 'date') {
                    // Parse DD/MM/YY
                    const parts = value.split('/');
                    if (parts.length === 3) {
                        const [d, m, y] = parts;
                        const fullYear = y.length === 2 ? `20${y}` : y;
                        const isoDate = `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                        const timePart = isoDateTime.split('T')[1] || '00:00';
                        handleChange({ target: { name, value: `${isoDate}T${timePart}` } });
                    }
                } else if (field === 'time') {
                    // Parse HH:MM
                    if (value.includes(':')) {
                        const datePart = isoDateTime.split('T')[0] || new Date().toISOString().split('T')[0];
                        handleChange({ target: { name, value: `${datePart}T${value}` } });
                    }
                }
            };

            return (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                        {label}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="DD/MM/YY"
                            value={displayDate}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow only numbers and /
                                if (/^[\d/]*$/.test(val) && val.length <= 8) {
                                    // Update immediately for typing
                                    const parts = val.split('/');
                                    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 2) {
                                        handleManualInput('date', val);
                                    }
                                }
                            }}
                            onBlur={(e) => handleManualInput('date', e.target.value)}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '0.875rem'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="HH:MM"
                            value={displayTime}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow only numbers and :
                                if (/^[\d:]*$/.test(val) && val.length <= 5) {
                                    if (val.length === 5 && val.includes(':')) {
                                        handleManualInput('time', val);
                                    }
                                }
                            }}
                            onBlur={(e) => handleManualInput('time', e.target.value)}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Format: DD/MM/YY • HH:MM (24-hour)
                    </div>
                </div>
            );
        }

        // For date type, use manual text input
        if (!isDisabled && type === 'date') {
            const dateValue = formData[name] || '';
            let displayDate = '';

            if (dateValue) {
                const [y, m, d] = dateValue.split('-');
                displayDate = `${d}/${m}/${y.slice(-2)}`;
            }

            const handleManualDateInput = (value) => {
                // Parse DD/MM/YY
                const parts = value.split('/');
                if (parts.length === 3) {
                    const [d, m, y] = parts;
                    const fullYear = y.length === 2 ? `20${y}` : y;
                    const isoDate = `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                    handleChange({ target: { name, value: isoDate } });
                }
            };

            return (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                        {label}
                    </label>
                    <input
                        type="text"
                        placeholder="DD/MM/YY"
                        value={displayDate}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^[\d/]*$/.test(val) && val.length <= 8) {
                                const parts = val.split('/');
                                if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 2) {
                                    handleManualDateInput(val);
                                }
                            }
                        }}
                        onBlur={(e) => handleManualDateInput(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
            );
        }

        // Standard input
        return (
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                    {label}
                </label>
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    required={!isDisabled && name === 'truckNumber'}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                    }}
                />
            </div>
        );
    };

    return (
        <div className="form-container">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{id ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>Vehicle Details</h3>
                {renderField('Truck Number', 'truckNumber', 'text', !isAdmin)}
                {renderField('Vehicle Type', 'vehicleType', 'text', false)}
                {renderField('Transporter Name', 'transporterName', 'text', false)}
                {renderField('Destination', 'destination', 'text', !isAdmin)}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {renderField('Scheduled Date', 'entryDate', 'date', !isAdmin)}
                    {renderField('Scheduled Time', 'entryTime', 'time', !isAdmin)}
                </div>

                <h3 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>Operations</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {renderField('Actual Entry', 'actualEntry', 'datetime-local', false)}
                    {renderField('Gate Out', 'gateOut', 'datetime-local', false)}
                </div>

                <h3 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>LR Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {renderField('LR Number', 'lrNumber', 'text', false)}
                    {renderField('LR Date', 'lrDate', 'date', false)}
                </div>

                <h3 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>E-Way Bill</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {renderField('E-Way Bill Number', 'ewayBill', 'text', false)}
                    {renderField('E-Way Bill Expiry', 'ewayBillExpiry', 'date', false)}
                </div>

                <h3 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>Notes</h3>
                <div style={{ marginBottom: '1rem' }}>
                    <textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        placeholder="Add any additional notes here..."
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                        {id ? 'Update' : 'Add'} Vehicle
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="btn-secondary" style={{ flex: 1 }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VehicleForm;
