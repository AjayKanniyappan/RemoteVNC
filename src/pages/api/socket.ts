import { Server as IOServer } from 'Socket.IO';
import Server from '@services/Server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

/**
 * It creates a new socket server, and when a client connects, it creates a new server instance for
 * that client
 * @param {NextApiRequest} _req - NextApiRequest - The request object
 * @param {NextApiResponseWithSocket} res - NextApiResponseWithSocket - This is the response object
 * that Next.js provides. We need to add a property to it so that we can access it later.
 * @returns The socket handler is being returned.
 */
function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) return res.end();

  const io = new IOServer(res.socket.server);
  res.socket.server.io = io;
  io.sockets.on('connection', (socket) => {
    const server = new Server(socket);
    server.connectClient();
    server.on('connect', () => {
      // For Debugging Purpose Only
      // eslint-disable-next-line no-console
      console.log('RemoteVNC client connected');
    });
    server.on('disconnect', () => {
      // For Debugging Purpose Only
      // eslint-disable-next-line no-console
      console.log('RemoteVNC client disconnected');
    });
    server.on('error', (error) => {
      // For Debugging Purpose Only
      // eslint-disable-next-line no-console
      console.error('RemoteVNC error', error);
    });
  });
  res.end();
}

export default SocketHandler;
