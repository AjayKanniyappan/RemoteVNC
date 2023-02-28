import { EventEmitter } from 'events';

class Screen {
  public canvas;

  public context: CanvasRenderingContext2D | null;

  public event = new EventEmitter();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.event.setMaxListeners(1);
    this.canvas.width = 800;
    this.canvas.height = 600;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  init(width: number, height: number) {}

  drawFrame(frame: vnc.DrawFrame) {
    const { image } = frame;
    const img = new Image();
    switch (image.encoding) {
      case 'raw':
        // eslint-disable-next-line no-case-declarations
        const imageData = this.context?.createImageData(frame.width, frame.height);
        imageData?.data.set(new Uint8Array(image.data));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.context?.putImageData(imageData!, frame.x, frame.y);
        break;
      case 'png':
      case 'jpeg':
        img.width = frame.width;
        img.height = frame.height;
        img.src = `data:image/${image.encoding};base64,${frame.image.data}`;
        img.onload = () => {
          this.context?.drawImage(img, frame.x, frame.y, frame.width, frame.height);
        };
        break;
      default:
        throw new Error('unknown rect encoding:image?.encoding');
    }
  }

  copyFrame(frame: vnc.CopyFrame) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: Screen.ts:18 ~ Screen ~ copyFrame ~ frame:', frame);
    return this.init;
  }
}

export default Screen;
