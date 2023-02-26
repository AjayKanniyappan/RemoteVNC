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

function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;
    io.sockets.on('connection', (socket) => {
      const server = new Server(socket);
      server.connectClient();
    });
  }
  res.end();
}

export default SocketHandler;
