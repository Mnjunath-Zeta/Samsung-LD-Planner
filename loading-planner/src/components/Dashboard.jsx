import React from 'react';
import { useData } from '../context/DataContext';
import VehicleCard from './VehicleCard';

const Dashboard = () => {
    const { vehicles } = useData();
    const [filterDate, setFilterDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [filterStatus, setFilterStatus] = React.useState('All');

    const filteredVehicles = vehicles.filter(v => {
        const matchesDate = filterDate ? v.entryDate === filterDate : true;
        const matchesStatus = filterStatus === 'All' ? true : v.status === filterStatus;
        return matchesDate && matchesStatus;
    });

    return (
        <div className="dashboard">
            {/* Header + Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Schedule</h2>
                    <span className="text-sm" style={{ fontWeight: 600, background: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                        {filteredVehicles.length} Trucks
                    </span>
                </div>

                {/* Filters Container */}
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

                    {/* Date Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Date:</span>
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
                                    padding: '0 0.25rem'
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status:</span>
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
                    <div style={{ fontSize: '0.875rem' }}>for {filterDate ? new Date(filterDate).toLocaleDateString() : 'selected criteria'}</div>
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
