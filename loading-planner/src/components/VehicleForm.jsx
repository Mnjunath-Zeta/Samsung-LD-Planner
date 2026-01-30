import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
    const { isAdmin } = useAuth();

    const isEditMode = !!id;
    const existingVehicle = isEditMode ? vehicles.find(v => v.id === id) : null;

    const [formData, setFormData] = useState({
        truckNumber: '',
        vehicleType: '',
        transporterName: '',
        destination: '',
        entryDate: new Date().toISOString().split('T')[0],
        entryTime: '',
        actualEntry: '',
        gateOut: '',
        lrNumber: '',
        lrDate: '',
        ewayBill: '',
        ewayBillExpiry: '',
        status: 'Scheduled'
    });

    useEffect(() => {
        if (existingVehicle) {
            setFormData(existingVehicle);
        }
    }, [existingVehicle]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            updateVehicle(id, formData);
        } else {
            addVehicle(formData);
        }
        navigate('/');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this scheduled truck?')) {
            deleteVehicle(id);
            navigate('/');
        }
    };

    if (isEditMode && !existingVehicle) return <div>Vehicle not found</div>;

    // Format Helpers (consistent with VehicleCard)
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
        return `${day}/${month}/${year} • ${time}`;
    };

    // Admin Field (Locked for User)
    const renderField = (label, name, type = 'text', adminOnly = false) => {
        const isDisabled = !isAdmin && adminOnly;

        let displayValue = formData[name] || '';

        // If Disabled, render a formatted static display to enforce Style preference
        if (isDisabled) {
            let formattedValue = displayValue;
            if (type === 'date' && displayValue) formattedValue = formatDate(displayValue);
            if (type === 'datetime-local' && displayValue) formattedValue = formatDateTime(displayValue);

            return (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                        {label}
                    </label>
                    <div style={{
                        padding: '0.5rem',
                        background: '#f1f5f9',
                        color: '#64748b',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.875rem'
                    }}>
                        {formattedValue || 'Locked'}
                    </div>
                </div>
            );
        }

        // If Enabled and Date/Time type, use Overlay Trick to enforce YY format
        if (!isDisabled && (type === 'date' || type === 'datetime-local')) {
            let formattedValue = displayValue;
            if (displayValue) {
                if (type === 'date') formattedValue = formatDate(displayValue);
                if (type === 'datetime-local') formattedValue = formatDateTime(displayValue);
            }

            return (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                        {label}
                    </label>
                    <div style={{ position: 'relative', width: '100%' }}>
                        {/* The Visual Display */}
                        <div style={{
                            padding: '0.5rem',
                            border: '1px solid #ccc', // Mimic standard input border
                            borderRadius: '4px',
                            background: '#fff',
                            fontSize: '0.875rem',
                            color: displayValue ? '#000' : '#888',
                            minHeight: '38px', // Approximate input height
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {formattedValue || (type === 'date' ? 'dd/mm/yy' : 'dd/mm/yy --:--')}
                        </div>

                        {/* The Invisible Native Input */}
                        <input
                            type={type}
                            name={name}
                            value={formData[name] || ''}
                            onChange={handleChange}
                            required={!isDisabled && name === 'truckNumber'}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            );
        }

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
                    style={{ width: '100%' }} // Ensure consistent width
                    required={!isDisabled && name === 'truckNumber'} // Basic validation
                />
            </div>
        );
    };

    return (
        <div className="vehicle-form fade-in">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.25rem' }}>{isEditMode ? 'Edit Details' : 'Add New Schedule'}</h2>
                {isEditMode && isAdmin ? (
                    <button onClick={handleDelete} className="btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                        <Trash2 size={20} />
                    </button>
                ) : <div style={{ width: 40 }} />}
            </div>

            <form onSubmit={handleSubmit} className="card">
                {/* Admin controlled fields */}
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>Trip Details</h3>
                {renderField('Truck Number', 'truckNumber', 'text', true)}
                {renderField('Vehicle Type', 'vehicleType', 'text', false)}
                {renderField('Transporter Name', 'transporterName', 'text', true)}
                {renderField('Destination', 'destination', 'text', true)}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {renderField('Scheduled Date', 'entryDate', 'date', true)}
                    {renderField('Scheduled Time', 'entryTime', 'time', true)}
                </div>

                {/* User editable fields */}
                <h3 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--secondary)', paddingBottom: '0.5rem' }}>Operations</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {renderField('Actual Entry', 'actualEntry', 'datetime-local', false)}
                    {renderField('Gate Out', 'gateOut', 'datetime-local', false)}
                </div>

                {renderField('LR Number', 'lrNumber', 'text', false)}
                {renderField('LR Date', 'lrDate', 'date', false)}

                {renderField('E-Way Bill', 'ewayBill', 'text', false)}
                {renderField('E-Way Bill Expiry', 'ewayBillExpiry', 'date', false)}

                <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default VehicleForm;
