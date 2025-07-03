// src/App.jsx
import React, { useState, useEffect } from 'react';
import socket from './socket';

import Login from './components/Login';
import GlobalChat from './components/GlobalChat';
import PrivateChat from './components/PrivateChat';
import RoomChat from './components/RoomChat';

function App() {
  const [username, setUsername] = useState('');
  const [publicMessage, setPublicMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (username) socket.emit('register_user', username);
  }, [username]);

  useEffect(() => {
    socket.on('receive_message', (data) => setMessageList((prev) => [...prev, data]));
    socket.on('receive_private_message', (data) => setPrivateMessages((prev) => [...prev, data]));
    socket.on('user_typing', (data) => setTypingStatus(`${data.username} is typing...`));
    socket.on('stop_typing', () => setTypingStatus(''));
    socket.on('update_users', (users) => setOnlineUsers(users));

    return () => socket.disconnect();
  }, []);

  const handlePublicTyping = (e) => {
    setPublicMessage(e.target.value);
    if (!isTyping) {
      socket.emit('user_typing', { username });
      setIsTyping(true);
    }
    setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing');
    }, 1500);
  };

  const handleSendPublicMessage = () => {
    if (publicMessage && username) {
      const data = {
        sender: username,
        message: publicMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', data);
      setMessageList((prev) => [...prev, data]);
      setPublicMessage('');
      socket.emit('stop_typing');
    }
  };

  const handlePrivateTyping = (e) => setPrivateMessage(e.target.value);

  const sendPrivateMessage = () => {
    if (username && recipient && privateMessage) {
      socket.emit('private_message', {
        recipient,
        sender: username,
        message: privateMessage,
      });
      setPrivateMessages((prev) => [
        ...prev,
        {
          sender: username,
          message: privateMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setPrivateMessage('');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {!username ? (
        <Login setUsername={setUsername} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Welcome, {username} 👋</h2>
            <span className="text-sm text-muted-foreground">
              Online: {onlineUsers.join(', ')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <GlobalChat
              username={username}
              message={publicMessage}
              messageList={messageList}
              typingStatus={typingStatus}
              handleTyping={handlePublicTyping}
              handleSend={handleSendPublicMessage}
            />
            <PrivateChat
              username={username}
              onlineUsers={onlineUsers}
              recipient={recipient}
              setRecipient={setRecipient}
              message={privateMessage}
              handleTyping={handlePrivateTyping}
              sendPrivateMessage={sendPrivateMessage}
              privateMessages={privateMessages}
            />
          </div>

          <RoomChat socket={socket} username={username} />
        </>
      )}
    </div>
  );
}

export default App;
