/**
 * A React component that renders a form.
 * @param  - FormProps
 * @returns A function that returns a JSX.Element
 */
function Form({ formSubmit }: vnc.FormProps): JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl lg:max-w-xl">
        <form className="card-body" onSubmit={formSubmit}>
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
            <span className="label label-text">Password (Optional)</span>
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
  );
}

export default Form;
