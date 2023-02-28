import Client from '@services/Client';

function Form(): JSX.Element {
  const handleSubmit = (event: React.FormEvent<vnc.LoginFormElements>) => {
    event.preventDefault();
    const config: vnc.Config = {
      host: event.currentTarget.elements.host.value,
      port: parseInt(event.currentTarget.elements.port.value, 10),
      password: event.currentTarget.elements.password.value,
    };
    const client = new Client(config);
    client.connectServer();
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="card w-96 shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <span className="label label-text">Remote Host</span>
              <input
                className="input input-bordered"
                type="text"
                placeholder="Ex: 192.168.1.1"
                id="host"
                name="host"
                required
              />
            </div>
            <div className="form-control">
              <span className="label label-text">Port Number</span>
              <input
                className="input input-bordered"
                type="number"
                placeholder="Ex: 5900"
                id="port"
                name="port"
                required
              />
            </div>
            <div className="form-control">
              <span className="label label-text">Password</span>
              <input
                className="input input-bordered"
                type="password"
                placeholder="password"
                id="password"
                name="password"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-info" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
