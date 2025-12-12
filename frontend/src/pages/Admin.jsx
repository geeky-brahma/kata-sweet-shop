import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Admin = () => {
    const [sweets, setSweets] = useState([]);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });

    const fetchSweets = async () => {
        try {
            const res = await api.get('/sweets/search');
            setSweets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sweets', formData);
            setFormData({ name: '', category: '', price: '', quantity: '' });
            fetchSweets();
        } catch (err) {
            alert('Error creating sweet');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/sweets/${id}`);
            fetchSweets();
        } catch (err) {
            alert('Error deleting');
        }
    };

    const handleRestock = async (id) => {
        const qty = prompt('How many to add?');
        if (!qty) return;
        try {
            await api.post(`/sweets/${id}/restock`, { quantity: parseInt(qty) });
            fetchSweets();
        } catch (err) {
            alert('Error restocking');
        }
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Add New Sweet</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label>Name</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label>Category</label>
                        <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label>Price</label>
                        <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label>Quantity</label>
                        <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required style={{ width: '100%' }} />
                    </div>
                    <button type="submit">Add</button>
                </form>
            </div>

            <div className="card">
                <h3>Inventory</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Stock</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sweets.map(sweet => (
                            <tr key={sweet.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem' }}>{sweet.name}</td>
                                <td style={{ padding: '1rem' }}>{sweet.category}</td>
                                <td style={{ padding: '1rem' }}>${sweet.price}</td>
                                <td style={{ padding: '1rem' }}>{sweet.quantity}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleRestock(sweet.id)} style={{ padding: '0.3em 0.6em', fontSize: '0.8em', background: '#3b82f6' }}>Restock</button>
                                    <button onClick={() => handleDelete(sweet.id)} style={{ padding: '0.3em 0.6em', fontSize: '0.8em', background: '#ef4444' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
