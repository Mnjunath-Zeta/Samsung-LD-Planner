import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const MOCK_DATA = [
    {
        id: '1',
        truckNumber: 'KA-01-AB-1234',
        vehicleType: 'Taurus',
        transporterName: 'VRL Logistics',
        destination: 'Bangalore',
        entryDate: '2023-10-25',
        entryTime: '10:00',
        actualEntry: '',
        gateOut: '',
        lrNumber: '',
        lrDate: '',
        ewayBill: '',
        ewayBillExpiry: '',
        status: 'Scheduled'
    },
    {
        id: '2',
        truckNumber: 'TN-05-XY-9876',
        vehicleType: 'Rigid',
        transporterName: 'Safe Express',
        destination: 'Chennai',
        entryDate: '2023-10-25',
        entryTime: '11:30',
        actualEntry: '2023-10-25T11:45',
        gateOut: '',
        lrNumber: 'LR-888',
        lrDate: '2023-10-25',
        ewayBill: 'EW-999',
        ewayBillExpiry: '2023-10-30',
        status: 'In Progress'
    }
];

export const DataProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('vehicles');
        let parsed = saved ? JSON.parse(saved) : MOCK_DATA;

        // Migration: Convert old split date/time fields to unified datetime fields
        parsed = parsed.map(v => {
            let updates = {};

            // Migrate Actual Entry
            if (!v.actualEntry) {
                if (v.actualEntryDate && v.actualEntryTime) {
                    updates.actualEntry = `${v.actualEntryDate}T${v.actualEntryTime}`;
                } else if (v.actualEntryTime && v.entryDate) {
                    // Fallback: Use scheduled date if actual date is missing
                    updates.actualEntry = `${v.entryDate}T${v.actualEntryTime}`;
                }
            }

            // Migrate Gate Out
            if (!v.gateOut) {
                if (v.gateOutDate && v.gateOutTime) {
                    updates.gateOut = `${v.gateOutDate}T${v.gateOutTime}`;
                } else if (v.gateOutTime) {
                    // Fallback prioritization for Gate Out Date
                    const fallbackDate = v.actualEntryDate || v.entryDate;
                    if (fallbackDate) {
                        updates.gateOut = `${fallbackDate}T${v.gateOutTime}`;
                    }
                }
            }
            return { ...v, ...updates };
        });

        return parsed;
    });

    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    const addVehicle = (vehicle) => {
        const newVehicle = { ...vehicle, id: Date.now().toString(), status: 'Scheduled' };
        setVehicles(prev => [newVehicle, ...prev]);
    };

    const updateVehicle = (id, updates) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    };

    const deleteVehicle = (id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    return (
        <DataContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle }}>
            {children}
        </DataContext.Provider>
    );
};
