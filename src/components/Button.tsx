function Button({ click }: vnc.ButtonProps): JSX.Element {
  return (
    <div className="fixed bottom-5">
      <button className="btn btn-primary" type="button" onClick={click}>
        Disconnect
      </button>
    </div>
  );
}

export default Button;
