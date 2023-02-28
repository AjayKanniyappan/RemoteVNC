import RFB, { createConnection, RfbClient } from 'rfb2';

class Remote {
  public config;

  public remote!: RfbClient;

  public RFB = RFB;

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
        throw new Error(`Remote server error: ${error}`);
      }
    });
  }
}

export default Remote;
