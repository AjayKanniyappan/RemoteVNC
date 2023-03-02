declare namespace vnc {
  type Api = {
    Boom: string;
  };
  type Canvas = HTMLCanvasElement | null | undefined;
  type Context = CanvasRenderingContext2D | null | undefined;
  type Client = {
    config: vnc.Config;
    socket: Socket;
    interval: NodeJS.Timer | number;
    RFBC: any;
  };
  type Config = {
    host: string;
    port: number;
    password: string;
  };
  type Image = {
    data: Buffer;
    encoding: string;
  };

  interface ButtonProps {
    click: () => void;
  }
  interface FormProps {
    formSubmit: (param: React.FormEvent<LoginFormElements>) => void;
  }
  interface CanvasProps {
    setCanvas: (param: HTMLCanvasElement | null) => void;
    setContext: (param: CanvasRenderingContext2D | undefined | null) => void;
    show: boolean
  }
  interface CopyFrame {
    width: number;
    height: number;
    x: number;
    y: number;
    src: {
      x: number;
      y: number;
    };
  }
  interface DrawFrame {
    width: number;
    height: number;
    x: number;
    y: number;
    image: Image;
  }
  interface FormElements extends HTMLFormControlsCollection {
    host: HTMLInputElement;
    port: HTMLInputElement;
    password: HTMLInputElement;
  }
  interface LoginFormElements extends HTMLFormElement {
    readonly elements: FormElements;
  }
  interface KeyLiteral {
    [key: number]: number[];
  }
}
