import './Chat.css';
import React, { useState, useEffect } from 'react'
import UserBox from './UserBox';
import axios from 'axios';
import { usePubNub } from 'pubnub-react';
const Chat = () => {
  const pubnub = usePubNub();
  const [channels, setChannels] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserID] = useState('default');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    setUserID(pubnub.getUserId());
    if (selectedUserId) {
      const newChannel = [userId, selectedUserId].sort().join('_');
      setChannels(newChannel);
      pubnub.subscribe({ channels: [newChannel] });
      if (newChannel) {
        fetchMessages(newChannel);
      }
      return () => {
        if (channels) {
          pubnub.unsubscribe({ channels: [channels] });
        }
      };
    }
  }, [pubnub, selectedUserId, userId, channels])

  useEffect(() => {
    pubnub.addListener({ message: handleMessage });
  }, [pubnub]);

  const fetchUserList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
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
    // console.log("event", event.message);
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      setMessages(messages => [...messages, text]);
    }
  };

  const sendMessage = message => {
    if (userId === "default") {
      console.log("Please log in to send a message.");
      alert("Please log in to send a message.");
      return;
    }
    if (message && channels) {
      pubnub
        .publish({ channel: channels, message })
        .then(() => setMessage(''));
    }
  };
  const handleUserClick = clickedUserId => {
    setSelectedUserId(clickedUserId);
  }

  const fetchMessages = async (Channel) => {
    try {
      const history = await pubnub.history({
        channel: Channel,
        count: 100,
      });
      const messagesFromHistory = history?.messages?.map((message) => {
        const timetoken = message.timetoken;
        const milliseconds = timetoken / 10000;
        const date = new Date(milliseconds);
        return {
          ...message,
          date: date.toLocaleString(),
        };
      });
      // console.log("messagesFromHistory", messagesFromHistory);
      setMessages(messagesFromHistory || []);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };
  const deleteMessage = async () => {
    try {
      const result = await pubnub.deleteMessages({
        channel: channels,
        start: "17047014092829076",
        end: "17047246129351932",
      });
      console.log("deleted function succesfully hit");
    } catch (status) {
      console.log(status);
    }
  }

  return (
    <div className='conatiner'>
      <div className='userlist'>
        <p>{selectedUserId}</p>
        <p>current userid : {userId}</p>

        <p>userlist</p>
        {userList.map((user) => (
          <UserBox key={user._id} id={user._id} name={user.username} onClick={handleUserClick} />
        ))}
      </div>
      <div>
        <p>message box</p>
        <div className='chatStyles'>
          <div className='liststyles'>
            {messages.map((message, index) => {
              return (
                <div key={`message-${index}`} className='messageStyles'>
                  {message.date && <>{message.date}<br /><br /></>}
                  {message.text || message.entry}
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
            <button onClick={deleteMessage}>deleteMessage</button>
          </div>
        </div>
      </div>
    </div>

  )
}
export default Chat;