import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Real-time listener for Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'vehicles'),
            (snapshot) => {
                const vehicleData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVehicles(vehicleData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching vehicles:', error);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const addVehicle = async (vehicle) => {
        try {
            await addDoc(collection(db, 'vehicles'), {
                ...vehicle,
                status: 'Scheduled',
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding vehicle:', error);
            alert('Failed to add vehicle. Please try again.');
        }
    };

    const updateVehicle = async (id, updates) => {
        try {
            const vehicleRef = doc(db, 'vehicles', id);
            await updateDoc(vehicleRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating vehicle:', error);
            alert('Failed to update vehicle. Please try again.');
        }
    };

    const deleteVehicle = async (id) => {
        try {
            await deleteDoc(doc(db, 'vehicles', id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Failed to delete vehicle. Please try again.');
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: 'var(--text-secondary)'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <DataContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle }}>
            {children}
        </DataContext.Provider>
    );
};
