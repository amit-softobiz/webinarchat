import './UserBox.css';
import React from 'react';

const UserBox = ({id,name,onClick}) => {
  const handleClick = () =>{
    onClick(id);
  }
  return (
    <div className='userboxcontainer' onClick={handleClick}>  <p>{id}</p>
  
    </div>
  )
}

export default UserBox