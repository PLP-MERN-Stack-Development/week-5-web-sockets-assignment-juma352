// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Backend server URL
export default socket;
