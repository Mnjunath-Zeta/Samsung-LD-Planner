import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const ManualDateInput = ({ label, value, onChange, disabled }) => {
    const [text, setText] = React.useState('');

    // Sync with value prop changes (initial load or external update)
    React.useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            const newText = `${d}/${m}/${y.slice(-2)}`;
            // Only update if significantly different to avoid cursor jumping during typing if round-trip occurs
            if (text !== newText) {
                setText(newText);
            }
        } else {
            if (text) setText('');
        }
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);

        if (val === '') {
            onChange('');
            return;
        }

        const parts = val.split('/');
        if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 2) {
            const [d, m, y] = parts;
            const iso = `20${y}-${m}-${d}`;
            const date = new Date(iso);
            if (!isNaN(date.getTime())) {
                onChange(iso);
            }
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>{label}</label>
            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="DD/MM/YY"
                disabled={disabled}
                className="input-field"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.875rem', background: disabled ? '#f3f4f6' : 'white' }}
            />
        </div>
    );
};

const ManualDateTimeInput = ({ label, value, onChange, disabled }) => {
    const [dateText, setDateText] = React.useState('');
    const [timeText, setTimeText] = React.useState('');

    React.useEffect(() => {
        if (value) {
            const [datePart, timePart] = value.split('T');
            if (datePart) {
                const [y, m, d] = datePart.split('-');
                const dFormatted = `${d}/${m}/${y.slice(-2)}`;
                if (dateText !== dFormatted) setDateText(dFormatted);
            }
            if (timePart) {
                const tFormatted = timePart.slice(0, 5);
                if (timeText !== tFormatted) setTimeText(tFormatted);
            }
        } else {
            if (dateText || timeText) {
                setDateText('');
                setTimeText('');
            }
        }
    }, [value]);

    const updateValue = (dText, tText) => {
        // Only trigger onChange if we have a potentially valid full datetime
        const dParts = dText.split('/');
        if (dParts.length === 3 && dParts[0].length === 2 && dParts[1].length === 2 && dParts[2].length === 2 && tText.length === 5) {
            const [d, m, y] = dParts;
            const iso = `20${y}-${m}-${d}T${tText}`;
            onChange(iso);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>{label}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={dateText}
                    onChange={(e) => {
                        const val = e.target.value;
                        setDateText(val);
                        updateValue(val, timeText);
                    }}
                    placeholder="DD/MM/YY"
                    disabled={disabled}
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: disabled ? '#f3f4f6' : 'white' }}
                />
                <input
                    type="text"
                    value={timeText}
                    onChange={(e) => {
                        const val = e.target.value;
                        setTimeText(val);
                        updateValue(dateText, val);
                    }}
                    placeholder="HH:MM"
                    disabled={disabled}
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: disabled ? '#f3f4f6' : 'white' }}
                />
            </div>
        </div>
    );
};

const ManualTimeInput = ({ label, value, onChange, disabled }) => {
    const [text, setText] = React.useState('');

    React.useEffect(() => {
        if (value) {
            const tFormatted = value.slice(0, 5);
            if (text !== tFormatted) setText(tFormatted);
        } else {
            if (text) setText('');
        }
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);

        if (val === '') {
            onChange('');
            return;
        }

        if (/^[\d:]*$/.test(val) && val.length <= 5) {
            if (val.length === 5 && val.includes(':')) {
                const [h, m] = val.split(':');
                const hNum = parseInt(h);
                const mNum = parseInt(m);
                if (hNum >= 0 && hNum < 24 && mNum >= 0 && mNum < 60) {
                    onChange(val);
                }
            }
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>{label}</label>
            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="HH:MM"
                disabled={disabled}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.875rem', background: disabled ? '#f3f4f6' : 'white' }}
            />
        </div>
    );
};

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
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
        notes: '',
        status: 'Scheduled'
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

        // For datetime-local, use manual text inputs
        if (type === 'datetime-local') {
            return (
                <ManualDateTimeInput
                    label={label}
                    value={formData[name]}
                    onChange={(val) => handleChange({ target: { name, value: val } })}
                    disabled={isDisabled}
                />
            );
        }

        // For date type, use manual text input
        if (type === 'date') {
            return (
                <ManualDateInput
                    label={label}
                    value={formData[name]}
                    onChange={(val) => handleChange({ target: { name, value: val } })}
                    disabled={isDisabled}
                />
            );
        }

        // For time type, use manual text input
        if (type === 'time') {
            return (
                <ManualTimeInput
                    label={label}
                    value={formData[name]}
                    onChange={(val) => handleChange({ target: { name, value: val } })}
                    disabled={isDisabled}
                />
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

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                    <select
                        name="status"
                        value={formData.status || 'Scheduled'}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
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
                    {id && isAdmin && (
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this vehicle?')) {
                                    deleteVehicle(id);
                                    navigate('/');
                                }
                            }}
                            className="btn-secondary"
                            style={{ flex: 1, borderColor: '#fee2e2', color: '#ef4444', background: '#fef2f2' }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default VehicleForm;
