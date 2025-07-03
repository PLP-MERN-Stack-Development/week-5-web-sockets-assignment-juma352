import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

import { useState, useEffect } from 'react';

export default function RoomChat({ socket, username }) {
  const [room, setRoom] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [roomMessage, setRoomMessage] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);

  const joinRoom = () => {
    if (roomInput !== '') {
      socket.emit('join_room', roomInput);
      setRoom(roomInput);
      setRoomMessages([]);
      setRoomInput('');
    }
  };

  const leaveRoom = () => {
    if (room) {
      socket.emit('leave_room', room);
      setRoom('');
      setRoomMessages([]);
      setRoomUsers([]);
    }
  };

  const sendRoomMessage = () => {
    if (room && roomMessage) {
      socket.emit('send_room_message', {
        room,
        sender: username,
        message: roomMessage,
      });
      setRoomMessages((prev) => [
        ...prev,
        {
          sender: username,
          message: roomMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setRoomMessage('');
    }
  };

  useEffect(() => {
    const handleRoomMessage = (data) => {
      if (data.room === room) {
        setRoomMessages((prev) => [...prev, data]);
      }
    };

    const handleRoomUsersUpdate = (users) => {
      setRoomUsers(users);
    };

    socket.on('receive_room_message', handleRoomMessage);
    socket.on('room_users_update', handleRoomUsersUpdate);

    return () => {
      socket.off('receive_room_message', handleRoomMessage);
      socket.off('room_users_update', handleRoomUsersUpdate);
    };
  }, [room, socket]);

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <h3 className="font-semibold text-lg">🛋️ Room Chat</h3>

        {!room ? (
          <div className="flex gap-2">
            <Input
              placeholder="Enter room name"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
            />
            <Button onClick={joinRoom}>Join Room</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p>
                📍 In room: <strong>{room}</strong>
              </p>
              <Button variant="destructive" size="sm" onClick={leaveRoom}>
                Leave
              </Button>
            </div>

            <p className="text-muted-foreground text-sm">
              👥 Members: {roomUsers.length ? roomUsers.join(', ') : 'Just you'}
            </p>

            <ScrollArea className="h-48 border rounded p-2 space-y-1 bg-gray-50">
              {roomMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm p-2 rounded ${
                    msg.sender === username
                      ? 'bg-green-500 text-white'
                      : 'bg-white'
                  }`}
                >
                  <strong>{msg.sender}</strong> <span className="text-xs text-gray-400">({msg.timestamp})</span>: {msg.message}
                </div>
              ))}
            </ScrollArea>

            <div className="flex gap-2 pt-2">
              <Input
                value={roomMessage}
                onChange={(e) => setRoomMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button onClick={sendRoomMessage}>Send</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
