import React, { useMemo } from 'react';
import { Clock, TrendingUp, Truck } from 'lucide-react';

const Analytics = ({ vehicles }) => {
    // Calculate stats
    const stats = useMemo(() => {
        let totalTurnaroundTime = 0;
        let completedCount = 0;
        const dailyCounts = {};

        // Helper to format date key (YYYY-MM-DD)
        const getDateKey = (dateStr) => {
            if (!dateStr) return null;
            return dateStr.split('T')[0]; // Handle ISO strings
        };

        vehicles.forEach(v => {
            // Volume per day (based on Scheduled Entry Date)
            if (v.entryDate) {
                const day = v.entryDate;
                dailyCounts[day] = (dailyCounts[day] || 0) + 1;
            }

            // Turnaround Time
            if (v.actualEntry && v.gateOut) {
                const start = new Date(v.actualEntry);
                const end = new Date(v.gateOut);
                const diffMs = end - start;
                if (diffMs > 0) { // Valid duration
                    totalTurnaroundTime += diffMs;
                    completedCount++;
                }
            }
        });

        // Average TAT in minutes
        const avgTATMinutes = completedCount > 0 ? (totalTurnaroundTime / completedCount) / (1000 * 60) : 0;
        const hours = Math.floor(avgTATMinutes / 60);
        const minutes = Math.floor(avgTATMinutes % 60);

        // Sort last 7 days for chart
        const sortedDays = Object.keys(dailyCounts).sort().slice(-7);
        const chartData = sortedDays.map(day => {
            const dateObj = new Date(day);
            const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
            return { label, count: dailyCounts[day] };
        });

        return {
            avgTAT: `${hours}h ${minutes}m`,
            chartData,
            totalVehicles: vehicles.length,
            completedCount
        };
    }, [vehicles]);

    if (!vehicles || vehicles.length === 0) return null;

    // Find max count for chart scaling
    const maxCount = Math.max(...stats.chartData.map(d => d.count), 1);

    return (
        <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Avg TAT Card */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <Clock size={16} />
                        Average Turnaround
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {stats.avgTAT}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Based on {stats.completedCount} completed trips
                    </div>
                </div>

                {/* Total Volume Card */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <Truck size={16} />
                        Total Vehicles
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {stats.totalVehicles}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Scheduled in system
                    </div>
                </div>
            </div>

            {/* Volume Chart */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <TrendingUp size={16} />
                    Volume (Last 7 Days)
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '8px', paddingBottom: '20px' }}>
                    {stats.chartData.length > 0 ? (
                        stats.chartData.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                <div style={{
                                    flex: 1,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '80%',
                                        background: 'var(--primary)',
                                        height: `${(d.count / maxCount) * 100}%`,
                                        borderRadius: '4px 4px 0 0',
                                        minHeight: '4px',
                                        opacity: 0.8,
                                        transition: 'height 0.3s ease'
                                    }}></div>
                                </div>
                                <div style={{ fontSize: '0.7rem', marginTop: '6px', color: 'var(--text-secondary)' }}>{d.label}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>{d.count}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.875rem' }}>
                            No data for last 7 days
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
