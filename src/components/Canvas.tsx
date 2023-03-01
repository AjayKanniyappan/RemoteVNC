import { useEffect, useRef } from 'react';
import styles from '@styles/Canvas.module.css';

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
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}

export default Canvas;
