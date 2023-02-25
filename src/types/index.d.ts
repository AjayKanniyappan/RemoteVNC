declare namespace vnc {
  type Api = {
    Boom: string;
  };
  type Config = {
    host: string;
    port: number;
    password: string;
  };

  interface FormElements extends HTMLFormControlsCollection {
    host: HTMLInputElement;
    port: HTMLInputElement;
    password: HTMLInputElement;
  }
  interface LoginFormElements extends HTMLFormElement {
    readonly elements: FormElements;
  }
}
