import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import VehicleCard from './VehicleCard';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
    const { vehicles } = useData();
    const { isAdmin } = useAuth();
    const [filterDate, setFilterDate] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState('All');

    const filteredVehicles = vehicles.filter(v => {
        const matchesDate = filterDate ? v.entryDate === filterDate : true;
        const matchesStatus = filterStatus === 'All' ? true : v.status === filterStatus;
        return matchesDate && matchesStatus;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const [y, m, d] = dateString.split('-');
        return `${d}/${m}/${y.slice(-2)}`;
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const time = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
        return `${day}/${month}/${year} ${time}`;
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('Vehicle Loading Schedule', 14, 20);

        // Subtitle with filter info
        doc.setFontSize(10);
        let subtitle = `Total Vehicles: ${filteredVehicles.length}`;
        if (filterDate) subtitle += ` | Date: ${formatDate(filterDate)}`;
        if (filterStatus !== 'All') subtitle += ` | Status: ${filterStatus}`;
        doc.text(subtitle, 14, 28);

        // Table data
        const tableData = filteredVehicles.map(v => [
            v.truckNumber || '-',
            v.vehicleType || '-',
            v.transporterName || '-',
            v.destination || '-',
            formatDate(v.entryDate) + ' ' + (v.entryTime || ''),
            formatDateTime(v.actualEntry),
            formatDateTime(v.gateOut),
            v.status || '-'
        ]);

        // Generate table
        doc.autoTable({
            startY: 35,
            head: [['Truck No.', 'Type', 'Transporter', 'Destination', 'Scheduled', 'Actual Entry', 'Gate Out', 'Status']],
            body: tableData,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [59, 130, 246] },
            columnStyles: {
                0: { cellWidth: 22 },
                1: { cellWidth: 18 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 28 },
                5: { cellWidth: 28 },
                6: { cellWidth: 28 },
                7: { cellWidth: 20 }
            }
        });

        // Save
        const filename = `vehicle-schedule-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
    };

    return (
        <div className="dashboard">
            {/* Header + Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Schedule</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="text-sm" style={{ fontWeight: 600, background: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                            {filteredVehicles.length} Trucks
                        </span>
                        {isAdmin && (
                            <button
                                onClick={exportToPDF}
                                className="btn-primary"
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                                title="Export to PDF"
                            >
                                <Download size={16} />
                                Export
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters Container */}
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

                    {/* Date Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px', minWidth: '200px', maxWidth: '100%' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Date:</span>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                padding: '0.35rem 0.5rem',
                                fontSize: '0.875rem',
                                flex: 1,
                                outline: 'none',
                                minWidth: 0
                            }}
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: '0 0.25rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px', minWidth: '200px', maxWidth: '100%' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Status:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                padding: '0.35rem 0.5rem',
                                fontSize: '0.875rem',
                                flex: 1,
                                outline: 'none',
                                background: 'white',
                                minWidth: 0
                            }}
                        >
                            <option value="All">All</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredVehicles.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 500 }}>No trucks found</div>
                    <div style={{ fontSize: '0.875rem' }}>
                        for {filterDate ? (() => {
                            const [y, m, d] = filterDate.split('-');
                            return `${d}/${m}/${y.slice(-2)}`;
                        })() : 'selected criteria'}
                    </div>
                </div>
            ) : (
                <div className="vehicle-list">
                    {filteredVehicles.map(vehicle => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
