import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async() => {
        try {
            await axios.post('http://localhost:3001/signup', { username, password });
            alert('Signup successful');
        } catch (error) {
            alert('Signup failed');
        }
        console.log('Signup clicked:', username, password);
    };

    return (
        <div>
            <h2>Signup</h2>
            <div>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleSignup}>Signup</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
