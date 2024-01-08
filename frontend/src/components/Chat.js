import './Chat.css';
import React, { useState, useEffect } from 'react'
import UserBox from './UserBox';
import axios from 'axios';
import { usePubNub } from 'pubnub-react';
import data from '../data/users/users.json'
const Chat = () => {
  const pubnub = usePubNub();
  const [channels,setChannels] = useState();
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserID] = useState();  
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userList, setUserList] = useState([]);
  
  useEffect(()=>{
    setUserID(pubnub.getUserId());
    if (selectedUserId) {
      const newChannel = [userId, selectedUserId].sort().join('_');
      setChannels(newChannel);
      pubnub.subscribe({ channels: [newChannel] });
      return () => {
        if (channels) {
          pubnub.unsubscribe({ channels: [channels] });
        }
      };
    }
  },[pubnub,selectedUserId,userId, channels])
  
  useEffect(() => {
    pubnub.addListener({ message: handleMessage });
  }, [pubnub]);

  const fetchUserList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      console.log("response=======", response.data);
      setUserList(response.data);
    } catch (error) {
      console.error('Error fetching user list', error);
    }
  };
  useEffect(() => {
    fetchUserList();
  }, []);
  
  const handleMessage = event => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      addMessage(messages => [...messages, text]);
    }
  };

  const sendMessage = message => {
    if (message) {
      pubnub
        .publish({ channel: channels, message })
        .then(() => setMessage(''));
    }
  };
  const handleUserClick = clickedUserId =>{
    setSelectedUserId(clickedUserId);
  }


 
  return (
    <div className='conatiner'>
      <div className='userlist'>
        <p>{selectedUserId}</p>
        <p>current userid : {userId}</p>
  
        <p>userlist</p>
        {userList.map((user) => (
          <UserBox key={user.id} id={user._id} name={user.username} onClick={handleUserClick} />
        ))}
      </div>
      <div>
        <p>message box</p>
        <div className='chatStyles'>
          <div className='liststyles'>
            {messages.map((message, index) => {
              return (
                <div key={`message-${index}`} className='messageStyles'>
                  {message}
                </div>
              );
            })}
          </div>
          <div>
            <input
              type="text"
              className="inputStyles"
              placeholder="Type your message"
              value={message}
              onKeyPress={e => {
                if (e.key !== 'Enter') return;
                sendMessage(message);
              }}
              onChange={e => setMessage(e.target.value)}
            />
            <button
              className="buttonStyles"
              onClick={e => {
                e.preventDefault();
                sendMessage(message);
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}
export default Chat;