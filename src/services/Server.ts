import { Socket } from 'socket.io';
import { EventEmitter } from 'events';
import getRgba from '@utils/getRgba';
import Remote from '@services/Remote';

class Server extends EventEmitter {
  public clients: vnc.Client[] = [];

  public initialFrame = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public remoteInstance: any;

  public RFB!: typeof import('rfb2');

  public socket;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
  }

  connectClient() {
    this.socket.on('init', async (config: vnc.Config) => {
      const remote = new Remote(config);

      try {
        this.RFB = remote.RFB;
        this.remoteInstance = await remote.remoteConnection();
        const client = {
          config,
          socket: this.socket,
          interval: 0,
          RFBC: this.remoteInstance,
        };
        this.eventHandler(client);
        this.socket.on('mouse', (event) => {
          this.remoteInstance.pointerEvent(event.x, event.y, event.button);
        });
        this.socket.on('keyboard', (event) => {
          this.remoteInstance.keyEvent(event.keyCode, event.isDown);
        });
        this.socket.on('disconnect', () => {
          this.disconnectClient(client);
        });
      } catch (error) {
        this.socket.emit('error', error);
      }
    });
  }

  connectionHandler(Client: vnc.Client) {
    this.remoteInstance.autoUpdate = true;
    this.socket.emit('init', {
      width: this.remoteInstance.width,
      height: this.remoteInstance.height,
    });
    const client = Client;
    client.interval = setInterval(() => {
      if (!this.initialFrame) {
        this.remoteInstance.requestUpdate(
          false,
          0,
          0,
          this.remoteInstance.width,
          this.remoteInstance.height,
        );
      }
    }, 300);
    this.clients.push(client);
    this.emit('connect', client);
  }

  eventHandler(client: vnc.Client) {
    this.remoteInstance.on('connect', () => {
      this.remoteInstance.updateClipboard('https://ajaykanniyappan.com');
      this.connectionHandler(client);
    });
    this.remoteInstance.on('error', (error: unknown) => {
      this.socket.emit('error', error);
      this.disconnectClient(client);
    });
    this.remoteInstance.on('clipboard', (newCopyData: unknown) => {
      // For Debugging Purpose Only
      // eslint-disable-next-line no-console
      console.log('RemoteVNC clipboard updated!', newCopyData);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.remoteInstance.on('rect', (frame: any) => {
      if (!this.initialFrame) {
        this.initialFrame = true;
      }

      const sendFrame = (image: vnc.Image) => {
        this.socket.emit('frame', {
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
          image,
        });
      };

      switch (frame.encoding) {
        case this.RFB.encodings.raw:
          this.encodeFrame(frame, sendFrame);
          break;
        case this.RFB.encodings.copyRect:
          this.socket.emit('copyFrame', {
            x: frame.x,
            y: frame.y,
            src: frame.src,
            width: frame.width,
            height: frame.height,
          });
          break;
        case this.RFB.encodings.hextile:
          frame.on('tile', () => {
            throw new Error('Hextile not implemented');
          });
          break;
        default:
          break;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  encodeFrame(frame: any, callBack: { (image: vnc.Image): void }) {
    if (this.initialFrame)
      callBack({
        encoding: 'raw',
        data: getRgba(frame.data),
      });
  }

  disconnectClient(client: vnc.Client) {
    for (let i = 0; i < this.clients.length; i += 1) {
      const connection = this.clients[i];
      if (connection === client) {
        connection.RFBC.end();
        clearInterval(connection.interval);
        this.emit('disconnect', client);
        this.clients.splice(i, 1);
        return;
      }
    }
  }
}

export default Server;
