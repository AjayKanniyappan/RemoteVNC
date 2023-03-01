import { useEffect, useRef } from 'react';

function Canvas({ setCanvas, setContext }: vnc.CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    setCanvas(canvas);
    setContext(context);
  }, [setCanvas, setContext]);

  return (
    <div className="h-screen absolute w-full overflow-hidden">
      <canvas className="cursor-none" ref={canvasRef} />
    </div>
  );
}

export default Canvas;
