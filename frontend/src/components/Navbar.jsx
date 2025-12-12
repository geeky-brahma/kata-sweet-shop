import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', textDecoration: 'none' }}>
                    🍭 Sweet Shop
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                        <span style={{ marginLeft: '1rem', color: '#64748b' }}>Welcome, {user.username}</span>
                        <button onClick={handleLogout} style={{ marginLeft: '1rem', padding: '0.4em 0.8em', fontSize: '0.9em' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
