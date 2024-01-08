import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import { usePubNub } from 'pubnub-react';
const Login = () => {
    const pubnub = usePubNub();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate  = useNavigate();
    const handleLogin = async() => {
        try {
            const data = await axios.post('http://localhost:3001/login', { username, password });
            await pubnub.setUserId(data.data.userId);
            alert(`${data.data.message}` );
            navigate('/');
        } catch (error) {
            alert(`${error}`);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Login</button>
                <p>Don't have an account? <Link to="/signup">Signup</Link></p>
            </div>
        </div>
    );
};

export default Login;
