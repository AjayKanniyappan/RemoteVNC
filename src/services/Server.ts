import { Socket } from 'Socket.IO';
import { PNG } from 'pngjs';
import { EventEmitter } from 'events';
import getRgba from '@utils/getRgba';
import Remote from '@services/Remote';

class Server {
  public clients: vnc.Client[] = [];

  public event = new EventEmitter();

  public initialFrame = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options: any = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public remoteInstance: any;

  public RFB!: typeof import('rfb2');

  public socket;

  constructor(socket: Socket) {
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
        this.remoteInstance.on('connect', () => {
          this.remoteInstance.updateClipboard('https://ajaykanniyappan.com');
        });
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

  connectionHandler(client: vnc.Client) {
    this.remoteInstance.autoUpdate = true;
    this.socket.emit('init', {
      width: this.remoteInstance.width,
      height: this.remoteInstance.height,
    });
    // eslint-disable-next-line no-param-reassign
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
    this.event.emit('connect', client);
  }

  eventHandler(client: vnc.Client) {
    this.remoteInstance.on('connect', this.connectionHandler(client));
    this.remoteInstance.on('error', (error: unknown) => {
      this.socket.emit('error', error);
      this.disconnectClient(client);
    });
    this.remoteInstance.on('clipboard', (newCopyData: unknown) => {
      // For Debugging Purpose Only
      // eslint-disable-next-line no-console
      console.log('remote clipboard updated!', newCopyData);
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
  encodeFrame(frame: any, callBack: any) {
    if (!this.options.png) {
      callBack({
        encoding: 'raw',
        data: getRgba(frame.data),
      });
    } else {
      const RGBA = getRgba(frame.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buffers: any[] = [];
      const png = new PNG({
        width: frame.width,
        height: frame.height,
      });
      RGBA.copy(png.data, 0, 0, RGBA.length);
      png.on('error', (error) => {
        throw new Error(`PNG error: ${error.message}`);
      });
      png.on('data', (buf) => {
        buffers.push(buf);
      });
      png.on('end', () => {
        callBack({
          encoding: 'png',
          data: Buffer.concat(buffers).toString('base64'),
        });
      });
      png.pack();
    }
  }

  disconnectClient(client: vnc.Client) {
    for (let i = 0; i < this.clients.length; i += 1) {
      const connection = this.clients[i];
      if (connection === client) {
        connection.RFBC.end();
        clearInterval(connection.interval);
        this.event.emit('disconnect', client);
        this.clients.splice(i, 1);
        break;
      }
    }
  }
}

export default Server;
