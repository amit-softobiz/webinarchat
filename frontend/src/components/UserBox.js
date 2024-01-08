import './UserBox.css';
import React from 'react';
import { usePubNub } from 'pubnub-react';

const UserBox = ({id,name,onClick}) => {
  const pubnub = usePubNub();
  const handleClick = () =>{
    onClick(id);
  }
  return (
    <div className='userboxcontainer' onClick={handleClick}> 
    {pubnub.getUserId() === id ? <p>Self</p>: <p>{name}</p>}
    </div>
  )
}

export default UserBox