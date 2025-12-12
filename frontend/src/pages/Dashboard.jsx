import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    const fetchSweets = async (query = '') => {
        try {
            const endpoint = query ? `/sweets/search?q=${query}` : '/sweets/search?q='; // Using search endpoint for all listing as per backend logic
            // Wait, backend has getAllSweets at /sweets, but search at /sweets/search.
            // Search endpoint returns all if q is empty? My backend search implementation checks `if (q)`.
            // If no query params, `findAll({where: {}})` which returns all. So /sweets/search works for all.
            const res = await api.get(endpoint);
            setSweets(res.data);
        } catch (err) {
            console.error('Failed to fetch sweets', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSweets(search);
    };

    const handlePurchase = async (id) => {
        try {
            await api.post(`/sweets/${id}/purchase`);
            // Refresh list
            fetchSweets(search);
            alert('Purchase successful! 🍬');
        } catch (err) {
            alert('Purchase failed: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="container">Loading sweets...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Available Sweets</h1>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Search sweets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {sweets.map(sweet => (
                    <div key={sweet.id} className="card">
                        <h3>{sweet.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9em' }}>{sweet.category}</p>
                        <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Rs.{sweet.price}</span>
                            <span style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: sweet.quantity > 0 ? '#dcfce7' : '#fee2e2',
                                color: sweet.quantity > 0 ? '#166534' : '#991b1b',
                                fontSize: '0.8em'
                            }}>
                                {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                        <button
                            onClick={() => handlePurchase(sweet.id)}
                            disabled={sweet.quantity <= 0}
                            style={{ width: '100%' }}
                        >
                            {sweet.quantity > 0 ? 'Purchase 🛒' : 'Sold Out'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
