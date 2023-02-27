import { Socket } from 'Socket.IO';
import Remote from '@services/Remote';
import EventEmitter from 'events';

class Server {
  public clients = {};

  public event = new EventEmitter();

  public initialFrame = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public remoteInstance: any;

  public socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  connectClient() {
    this.socket.on('init', async (config: vnc.Config) => {
      const client = {
        config,
        socket: this.socket,
      };
      const remote = new Remote(config);
      try {
        this.remoteInstance = await remote.remoteConnection();
        this.eventHandler(client);
        this.remoteInstance.on('connect', () => {
          this.remoteInstance.updateClipboard('send text to remote clipboard');
        });
        this.socket.on('mouse', (event) => {
          this.remoteInstance.pointerEvent(event.x, event.y, event.button);
        });
        this.socket.on('keyboard', (event) => {
          this.remoteInstance.keyEvent(event.keyCode, event.isDown);
        });
        this.socket.on('disconnect', () => {
          this.disconnectClient();
        });
      } catch (error) {
        this.socket.emit('error', error);
      }
    });
    return this.socket;
  }

  connectionHandler(client: unknown) {
    this.remoteInstance.autoUpdate = true;
    this.socket.emit('init', {
      width: this.remoteInstance.width,
      height: this.remoteInstance.height,
    });
    /*  client.interval = setInterval(() => {
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
    this.clients.push(client); */
    this.event.emit('connect', client);
  }

  eventHandler(client: unknown) {
    this.remoteInstance.on('connect', this.connectionHandler(client));
    this.remoteInstance.on('error', (error: unknown) => {
      this.socket.emit('error', error);
      this.disconnectClient();
    });
    this.remoteInstance.on('clipboard', (newPasteBufData: unknown) => {
      // eslint-disable-next-line no-console
      console.log('remote clipboard updated!', newPasteBufData);
    });
    this.remoteInstance.on('*', () => {
      // self.error(new Error(`rfb things: ${error.message}`));
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.remoteInstance.on('rect', (frame: vnc.DrawFrame) => {
      if (!this.initialFrame) {
        this.initialFrame = true;
      }

      /*      const sendFrame = (image: vnc.Image) => {
        this.socket.emit('frame', {
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
          image,
        });
      }; */

      /*     switch (frame.encoding) {
        case frame.encoding.raw:
          this.encodeFrame(frame, sendFrame);
          break;
        case rfb.encodings.copyRect:
          this.socket.emit('copyFrame', {
            x: frame.x,
            y: frame.y,
            src: frame.src,
            width: frame.width,
            height: frame.height,
          });
          break;
        case rfb.encodings.hextile:
          frame.on('tile', () => {
            throw new Error('Hextile not implemented');
          });
          break;
        default:
          break;
      } */
    });
  }

  // encodeFrame(frame, callBack) {}

  // eslint-disable-next-line class-methods-use-this
  disconnectClient() {}
}

export default Server;
