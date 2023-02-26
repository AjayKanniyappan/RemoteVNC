import { createConnection } from 'rfb2';

class Remote {
  public config;

  public remote: unknown;

  constructor(configuration: vnc.Config) {
    this.config = configuration;
  }

  remoteConnection() {
    return new Promise((resolve, reject) => {
      try {
        this.remote = createConnection({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password,
        });
        resolve(this.remote);
      } catch (error) {
        reject(error);
        throw new Error(`Remote error: ${error}`);
      }
    });
  }
}

export default Remote;
