import { EventEmitter } from 'events';

class ScreenHandler extends EventEmitter {
  public canvas!: HTMLCanvasElement;

  public context!: CanvasRenderingContext2D;

  public hasHandlers = false;

  public scaleFactor = 1;

  private state = 0;

  private x = 0;

  private y = 0;

  init(
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) {
    this.canvas = canvas;
    this.context = context;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.imageSmoothingEnabled = false;
    this.setMaxListeners(1);
    this.scaleScreen();
    this.addHandlers();
  }

  addHandlers() {
    this.hasHandlers = true;

    /* GLOBAL MOUSE EVENT */
    this.canvas.addEventListener(
      'mousedown',
      (event) => {
        this.onmousedown(event);
      },
      false,
    );
    this.canvas.addEventListener(
      'mouseup',
      (event) => {
        this.onmouseup(event);
      },
      false,
    );
    this.canvas.addEventListener('mousemove', (event) => {
      this.onmouseup(event);
    });

    /* GLOBAL KEYBOARD EVENT */
    document.addEventListener(
      'keydown',
      (event) => {
        this.onkeydown(event);
      },
      false,
    );
    document.addEventListener(
      'keyup',
      (event) => {
        this.onkeydown(event);
      },
      false,
    );

    window.addEventListener('resize', () => {
      this.scaleScreen();
    });
  }

  copyFrame(frame: vnc.CopyFrame) {
    const imageData = this.context.getImageData(
      frame.src.x,
      frame.src.y,
      frame.width,
      frame.height,
    );
    this.context.putImageData(imageData, frame.x, frame.y);
  }

  drawFrame(frame: vnc.DrawFrame) {
    const { image } = frame;
    const img = new Image();
    switch (image.encoding) {
      case 'raw': {
        const imageData = this.context?.createImageData(frame.width, frame.height);
        imageData?.data.set(new Uint8Array(image.data));
        this.context?.putImageData(imageData, frame.x, frame.y);
        break;
      }
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
        throw new Error('unknown rect encoding');
    }
  }

  onmousedown(event: MouseEvent) {
    this.state = 1;
    this.emit('mouseEvent', this.screenX(event.pageX), this.screenY(event.pageY), this.state);
    event.preventDefault();
  }

  onmouseup = (event: MouseEvent) => {
    this.state = 0;
    this.emit('mouseEvent', this.screenX(event.pageX), this.screenY(event.pageY), this.state);
    event.preventDefault();
  };

  onmousemove = (event: MouseEvent) => {
    this.emit('mouseEvent', this.screenX(event.pageX), this.screenY(event.pageY), this.state);
    event.preventDefault();
  };

  onkeydown = (event: KeyboardEvent) => {
    this.emit('keyEvent', event.keyCode, event.shiftKey, 1);
    event.preventDefault();
  };

  onkeyup = (event: KeyboardEvent) => {
    this.emit('keyEvent', event.keyCode, event.shiftKey, 0);
    event.preventDefault();
  };

  scaleScreen() {
    const screenWidth = (window.innerWidth * 0.9) / this.canvas.width;
    const screenHeight = (window.innerHeight * 0.9) / this.canvas.height;
    const screen = Math.min(screenWidth, screenHeight);
    this.scaleFactor = screen;
    this.x = (window.innerWidth - this.canvas.width * screen) / 2 / screen;
    this.y = (window.innerHeight - this.canvas.height * screen) / 2 / screen;
    const transform = `scale(${screen}) translate(${this.x}px, ${this.y}px)`;
    this.canvas.style.transform = transform;
  }

  screenX(pageX: number) {
    return pageX / this.scaleFactor - this.x;
  }

  screenY(pageY: number) {
    return pageY / this.scaleFactor - this.y;
  }

  removeHandlers() {
    if (!this.hasHandlers) return;

    this.canvas.removeEventListener('mouseup', this.onmouseup);
    this.canvas.removeEventListener('mousedown', this.onmousedown);
    this.canvas.removeEventListener('mousemove', this.onmousemove);
    document.removeEventListener('keydown', this.onkeydown);
    document.removeEventListener('keyup', this.onkeyup);
    window.removeEventListener('resize', () => {
      this.scaleScreen();
    });
    this.hasHandlers = false;
  }
}

export default ScreenHandler;
