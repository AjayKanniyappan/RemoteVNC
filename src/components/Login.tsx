/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import Client from '@/services/Client';

function Login() {
  const [host, setHost] = useState<number | string>();
  const [port, setPort] = useState<number>();
  const [password, setPassword] = useState<number | string>();

  const handleLogin = () => {
    const config = {
      host,
      port,
      password,
    };
    const client = new Client(config);
    // eslint-disable-next-line no-console
    console.log(client.connect());
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card flex-shrink-0 w-96 shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Host</span>
              </label>
              <input
                onChange={(e) => {
                  setHost(e.target.value);
                }}
                type="number"
                placeholder="192.168.1.1"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Port</span>
              </label>
              <input
                onChange={(e) => {
                  setPort(parseInt(e.target.value, 10));
                }}
                type="number"
                placeholder="5900"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-info" type="button" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
