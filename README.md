# Real-Time Chat Application

## Project Overview
This project is a real-time chat application consisting of a frontend built with React and a backend built with Node.js, Express, and Socket.IO. The application supports global chat, private messaging, and chat rooms with real-time updates.

---

## Project Structure

### Frontend (`real-time-chat-frontend`)
- **src/components/**
  - `GlobalChat.jsx`: Displays the global chat room where all users can send and receive messages.
  - `Login.jsx`: Provides a simple login interface for users to enter their username.
  - `PrivateChat.jsx`: Allows users to send private messages to other online users.
  - `RoomChat.jsx`: Enables users to join chat rooms, send messages within rooms, and see room members.
- **src/components/ui/**
  - Reusable UI components such as `Avatar`, `Button`, `Card`, `Input`, `ScrollArea`, and `Tabs` that are used throughout the app for consistent styling and behavior.
- **src/lib/utils.js**
  - Utility functions used across the frontend.
- **src/socket.js**
  - Socket.IO client setup for real-time communication with the backend.

### Backend (`real-time-chat-backend`)
- `index.js`: Main server file that sets up an Express server with Socket.IO for handling real-time chat functionality.
  - Manages user connections and registrations.
  - Handles public chat message broadcasting.
  - Supports typing indicators.
  - Manages private messaging between users.
  - Supports chat rooms with join, leave, messaging, and user list updates.
- `package.json` and `package-lock.json`: Backend dependencies and scripts.

---

## How to Navigate the Project

1. **Frontend**
   - The React app is located in the `real-time-chat-frontend` directory.
   - Components are organized under `src/components` with UI elements in `src/components/ui`.
   - The main entry point is `src/main.jsx`.
   - Socket.IO client is configured in `src/socket.js`.
   - To run the frontend, navigate to `real-time-chat-frontend` and run:
     ```bash
     npm install
     npm run dev
     ```

2. **Backend**
   - The backend server is located in the `reat-time-chat-backend` directory.
   - The main server logic is in `index.js`.
   - To run the backend, navigate to `reat-time-chat-backend` and run:
     ```bash
     npm install
     node index.js
     ```

---

## Summary of Components and Their Purpose

| Component       | Purpose                                                                                  |
|-----------------|------------------------------------------------------------------------------------------|
| GlobalChat      | Displays the global chat room for all users to communicate in real-time.                 |
| Login           | Allows users to enter their username to join the chat.                                  |
| PrivateChat     | Enables private messaging between online users.                                         |
| RoomChat        | Allows users to join chat rooms, send messages, and see other members in the room.      |
| UI Components   | Reusable styled components for consistent UI elements like buttons, inputs, cards, etc. |

---

This README should help new developers and users understand the project structure, navigate the codebase, and get started with running the application.
