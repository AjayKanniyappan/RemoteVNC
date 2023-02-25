import { io as IOClient, Socket } from 'socket.io-client';

class Client {
  public config: vnc.Config;

  public socket!: Socket;

  constructor(configuration: vnc.Config) {
    this.config = configuration;
  }

  async connect() {
    await fetch('/api/socket');
    this.socket = IOClient();
    this.socket.emit('init', this.config);
    return this.socket;
  }
}

export default Client;
