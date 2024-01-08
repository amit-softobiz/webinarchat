import './Nav.css';
// import React, {useEffect, useState} from 'react';
// import { usePubNub } from 'pubnub-react';
import { Link } from 'react-router-dom';
const Nav = () => {
    // const pubnub = usePubNub();
    // const [userId, setUserID] = useState();
    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     setUserID(pubnub.getUserId());
    //     console.log("Updated userId:", pubnub.getUserId());
    //   }, [pubnub,userId]);
    return (
        <div className='Nav'> 
        <Link to="/login">
            <button>Login</button>
        </Link></div>
    )
}

export default Nav