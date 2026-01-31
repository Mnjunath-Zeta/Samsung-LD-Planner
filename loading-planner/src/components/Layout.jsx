import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, User, LogOut, Plus, Database } from 'lucide-react';
import { migrateLocalStorageToFirestore } from '../migrate';

const Layout = () => {
    const { userRole, logout, user } = useAuth();
    const location = useLocation();

    return (
        <div className="layout">
            <header className="glass" style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.85)'
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
                        <Truck size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '1rem', lineHeight: 1, fontWeight: 700, color: 'var(--primary)' }}>Samsung SDS</h1>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>LD Plan</span>
                        <span className="text-sm" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {userRole === 'admin' ? 'Admin Portal' : 'User Portal'}
                        </span>
                    </div>
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {userRole === 'admin' && (
                        <button
                            onClick={async () => {
                                if (window.confirm('Migrate localStorage data to Firestore? This should only be done once.')) {
                                    await migrateLocalStorageToFirestore();
                                    alert('Migration completed! Refresh the page.');
                                }
                            }}
                            className="btn-secondary"
                            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                            title="Migrate Data"
                        >
                            <Database size={16} />
                        </button>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            {user?.username}
                        </span>
                        <button
                            onClick={logout}
                            className="btn-secondary"
                            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ padding: '1rem', paddingBottom: '6rem' }}>
                <Outlet />
            </main>

            {userRole === 'admin' && location.pathname === '/' && (
                <Link
                    to="/add"
                    className="btn-primary"
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        borderRadius: '50%',
                        width: '3.5rem',
                        height: '3.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <Plus size={24} />
                </Link>
            )}
        </div>
    );
};

export default Layout;
