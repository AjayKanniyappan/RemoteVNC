import { useState } from 'react';
import Client from '@services/Client';
import Button from '@components/Button';
import Canvas from '@components/Canvas';
import Form from '@components/Form';

/* Client Object Instance */
const client = new Client();

function Controller(): JSX.Element {
  const [canvas, setCanvas] = useState<vnc.Canvas>(null);
  const [context, setContext] = useState<vnc.Context>(null);
  const [isShow, setIsShow] = useState(false);

  const onSubmit = async (event: React.FormEvent<vnc.LoginFormElements>) => {
    event.preventDefault();
    const config: vnc.Config = {
      host: event.currentTarget.elements.host.value,
      port: parseInt(event.currentTarget.elements.port.value, 10),
      password: event.currentTarget.elements.password.value,
    };

    try {
      await client.connectServer(config, canvas, context);
      setIsShow(true);
    } catch (error: unknown) {
      throw new Error('Error!');
    }
  };

  const onClick = () => {
    client.disconnectServer();
    setIsShow(false);
  };

  return (
    <div>
      <Canvas setCanvas={setCanvas} setContext={setContext} show={isShow} />
      {!isShow ? <Form formSubmit={onSubmit} /> : null}
      {isShow ? <Button click={onClick} /> : null}
    </div>
  );
}

export default Controller;
