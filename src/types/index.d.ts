declare namespace vnc {
  type Api = {
    Boom: string;
  };
  type Config = {
    host: string;
    port: number;
    password: string;
  };
  type Image = {
    data: ArrayBuffer;
    encoding: string;
  };

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
