// Migration script to move localStorage data to Firestore
// Run this once to migrate existing data

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const migrateLocalStorageToFirestore = async () => {
    try {
        const saved = localStorage.getItem('vehicles');
        if (!saved) {
            console.log('No localStorage data to migrate');
            return;
        }

        const vehicles = JSON.parse(saved);
        console.log(`Migrating ${vehicles.length} vehicles to Firestore...`);

        for (const vehicle of vehicles) {
            // Remove the old ID since Firestore will generate new ones
            const { id, ...vehicleData } = vehicle;

            await addDoc(collection(db, 'vehicles'), {
                ...vehicleData,
                createdAt: serverTimestamp()
            });
        }

        console.log('Migration completed successfully!');
        // Optionally clear localStorage after successful migration
        // localStorage.removeItem('vehicles');
    } catch (error) {
        console.error('Migration failed:', error);
    }
};
