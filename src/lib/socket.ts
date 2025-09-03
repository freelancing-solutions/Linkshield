import { Server } from 'socket.io';

let ioInstance: Server;

export const setupSocket = (io: Server) => {
  ioInstance = io; // Store the io instance
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

export const getIoInstance = (): Server => {
  if (!ioInstance) {
    throw new Error('Socket.IO instance not initialized. Call setupSocket first.');
  }
  return ioInstance;
};
