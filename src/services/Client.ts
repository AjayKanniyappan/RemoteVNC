import IOClient from 'socket.io-client';

class Client {
  public host: string | number | undefined;

  public port: number | undefined;

  public password: string | number | undefined;

  constructor(config: {
    host: number | string | undefined;
    port: number | undefined;
    password: number | string | undefined;
  }) {
    this.host = config.host;
    this.port = config.port;
    this.password = config.password;
  }

  // eslint-disable-next-line class-methods-use-this
  async connect() {
    await fetch('/api/socket');
    const io = IOClient();
    io.on('connect', () => {
      // console.log('connected');
      io.emit('init', 12);
    });
    io.emit('init', 12);
    io.on('disconnect', () => {
      // console.log('dis');
    });
  }
}

export default Client;
