import RFB, { createConnection } from 'rfb2';

class Remote {
  public config;

  public RFB = RFB;

  constructor(configuration: vnc.Config) {
    this.config = configuration;
  }

  remoteConnection() {
    return new Promise((resolve, reject) => {
      try {
        const remote = createConnection({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password,
        });
        resolve(remote);
      } catch (error) {
        reject(error);
        throw new Error(`Remote server error: ${error}`);
      }
    });
  }
}

export default Remote;
